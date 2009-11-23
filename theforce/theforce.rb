# Make passed in arguments nicer
url = ARGV[0]
project_path = ARGV[1]
selected_text = ARGV[2]

# Load up the rails environment (force development)
ENV['RAILS_ENV'] = 'development'
require File.expand_path("#{project_path}/config/environment")

# All the files we want to open, as an array
files_to_open = []

# Get the route of the controller first
path = ActionController::Routing::Routes.recognize_path(url)

# Processing IndexController#index (for 127.0.0.1 at 2008-04-13 06:40:20) [GET]
# $1 => 'ActionController#index', $2 => 'GET'
REQUEST_BEGIN_MATCHER = /Processing\s+(\S+Controller#\S+) \(for.+\) \[(GET|POST|PUT|DELETE)\]$/

# Completed in 3.48602 (0 reqs/sec) | Rendering: 1.53868 (44%) | DB: 0.79623 (22%) | 200 OK [http://www.example.com]
# $1 => 3.48602, $2 => 1.53868, $3 => 44, $4 => 0.79623, $5 => 22, $6 => 200 OK, $7 => http://www.example.com
REQUEST_COMPLETION_FULL_MATCHER = /^Completed in (\d+\.\d+).+Rendering: (\d+\.\d+) \((\d+)%\).+DB: (\d+\.\d+) \((\d+)%\) \| ([1-5]\d{2} \S+) \[(.+)\]$/

# Start not observing
observing = false

# Open the last n lines of the log to check the results
LINES_TO_TAIL = 2000
lines = `tail -n #{LINES_TO_TAIL} #{project_path}/log/development.log`

lines.each do |line|
  if match = line.match(REQUEST_BEGIN_MATCHER) # Start observing (Processing...)
    request = match[1]
    if request == "#{path[:controller].capitalize}Controller##{path[:action]}"
      observing = true
      files_to_open = [] # Clear array and start over
    end
  elsif line.match(REQUEST_COMPLETION_FULL_MATCHER) # Stop observing (Completed...)
    observing = false
  end
    
  if observing
    if line.index("Rendered")
      files_to_open << File.expand_path("#{project_path}/app/views/#{line.split[1]}.html.erb")
    elsif line.index("Rendering") && line.split.last != "(not_found)"
      files_to_open << File.expand_path("#{project_path}/app/views/#{line.split.last}.html.erb")
    end
  end
end

# Remember the controller route we found before? Also open it
files_to_open << File.expand_path("#{project_path}/app/controllers/#{path[:controller]}_controller.rb")

file_to_select = nil
line_number = 0
if selected_text
  # Selected text is passed in, look for it
  files_to_open.each do |f|
    sed_line = `sed -ne /"#{selected_text.gsub('/', '\/')}"/= #{f}`.split("\n").first.to_i
    if sed_line > 0
      line_number = sed_line
      file_to_select = f
    end
  end
end

unless file_to_select
  # Find line number of the action
  file = File.new(File.expand_path("#{project_path}/app/controllers/#{path[:controller]}_controller.rb"), "r")
  while (line = file.gets)
    line_number += 1
    break if line.index "def #{path[:action]}"
  end
  file.close
  
  file_to_select = files_to_open[-1]
end

# Open everything we found in a new textmate project
# `mate #{files_to_open.uniq.join(" ")}`

# Go to the line of the file at the top of the stack
`mate --line #{line_number} #{file_to_select}`
