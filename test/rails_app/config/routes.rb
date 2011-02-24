# Simple Rack application for loading javascript files.
class JavaScriptLoader
  def self.call(env)
    params = env['action_dispatch.request.path_parameters']
    path   = Rails.root.join('..', '..', params[:path]).to_s
    
    if File.file?(path)
      [200, {"Content-Type" => "text/javascript"}, File.read(path)]
    else
      [404, {"Content-Type" => "text/html"}, "<!DOCTYPE html><html><body><h1>404 Not Found</h1><p>No such file <tt>#{path}</tt></p></body></html>"]
    end
  end
end

App::Application.routes.draw do
  match "/javascripts/*path" => JavaScriptLoader
  
  resources :posts, :except => [:new, :edit] do
    put :publish, :on => :member
  end
  
  match '/:action.html' => 'root', :constraints => { :action => /unit|ujs/ }, :format => 'html'
  root :to => 'root#index'
end
