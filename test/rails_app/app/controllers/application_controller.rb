class ApplicationController < ActionController::Base
  class UnverifiedRequest < StandardError
  end

  protect_from_forgery

  rescue_from UnverifiedRequest do
    head :forbidden
  end

  def handle_unverified_request
    super
    raise UnverifiedRequest.new("Bad!")
  end
end
