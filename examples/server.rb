require "rubygems"
require "sinatra"
require "active_support/json"

set :public, File.expand_path('../..', __FILE__)
set :method_override, true

get "/" do
  redirect "/examples"
end

get "/examples" do
  browse("examples")
end

get "/examples/ui" do
  browse("examples/ui")
end

def browse(path)
  contents = "<!DOCTYPE html>\n<html>\n<body><ul>"
  
  Dir.open(File.expand_path("../../" + path, __FILE__)) do |d|
    d.each do |f|
      next if [".", ".."].include?(f)
      
      contents += "<li><a href=\"/#{path}/#{f}\">#{f}</a></li>\n"
    end
  end
  
  contents + "</ul>\n</body>\n</html>"
end

