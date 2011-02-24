class PostsController < ApplicationController
  class NotFound < StandardError
  end

  respond_to :html, :xml, :json

  rescue_from NotFound do
    head :not_found
  end

  def index
    @posts = posts
    respond_with(@posts)
  end

  def show
    @post = post
    respond_with(@post)
  end

  def create
    if params[:post]['title'].blank?
      head :precondition_failed
    else
      @post = params[:post].merge(:id => posts.size)
      respond_with({:post => @post}, :location => post_url(@post['id']))
    end
  end

  def update
    if params[:post]['title'].blank?
      head :precondition_failed
    else
      @post = post.merge(params[:post])
      
      respond_with(@post) do |format|
        format.html { redirect_to post_url(@post['id']) }
      end
    end
  end

  def publish
    @post = post
    
    respond_with(@post) do |format|
      format.html { redirect_to post_url(@post['id']) }
    end
  end

  def destroy
    @post = post
    
    respond_with(@post) do |format|
      format.html { redirect_to posts_url }
    end
  end

  private
    def posts
      [
        { :post => { :id => 0, :title => '1st Post' } },
        { :post => { :id => 1, :title => '2nd Post' } }
      ]
    end

    def post
      post = posts[params[:id].to_i]
      raise NotFound.new("No such Post.") unless post
      post
    end
end
