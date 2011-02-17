require "rubygems"
require "sinatra"
require "active_support/ordered_hash"
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

$names = [
  { :id => 1, :name => 'julien'   },
  { :id => 2, :name => 'céline'   },
  { :id => 3, :name => 'jeanmary' },
  { :id => 4, :name => 'cécile'   },
  { :id => 5, :name => 'suzanne'  },
]

get "/search" do
  contents = ""
  
  $names.each do |name|
    re = Regexp.new('^' + Regexp.quote(params[:firstname]))
    contents += "<li>#{name[:name].capitalize}</li>" if name[:name] =~ re
  end
  
  contents
end

get "/search.json" do
  content_type :json
  
  names = $names.reject do |name|
    re = Regexp.new('^' + Regexp.quote(params[:firstname]))
    !(name[:name] =~ re)
  end
  
  if params[:cb]
    params[:cb] + "(" + names.to_json + ");"
  else
    names.to_json
  end
end

def browse(path)
  contents = "<!DOCTYPE html>\n<html>\n<body><ul>"
  
  Dir.open(File.expand_path("../../" + path, __FILE__)) do |d|
    d.each do |f|
      contents += "<li><a href=\"/#{path}/#{f}\">#{f}</a></li>\n" unless [".", ".."].include?(f)
    end
  end
  
  contents + "</ul>\n</body>\n</html>"
end

