defmodule ChatWeb.Router do
  use ChatWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
    plug :our_auth
    plug :fetch_user_token
    plug(ChatWeb.UserToken)
    # plug :put_user_token
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", ChatWeb do
    pipe_through :browser # Use the default browser stack

    get "/", PageController, :index
  end

  # Other scopes may use custom stacks.
  # scope "/api", ChatWeb do
  #   pipe_through :api
  # end

  defp our_auth(conn, _) do
    
    user_id = get_session(conn, :user_id)
    |> IO.inspect

    if user_id === nil do
      import Ecto
      user_id = Ecto.UUID.generate
      
      token = Phoenix.Token.sign(conn, "user salt", user_id)
      conn
      |> put_session(:user_token, token)
      
      user_id = get_session(conn, :user_id)
      |> IO.inspect

      # require IEx
      # IEx.pry
    end

    conn
  end

  def fetch_user_token(conn, _) do
    conn
    |> assign(:user_id, get_session(conn, :user_id))
  end

  defp put_user_token(conn, _) do
    if current_user == conn.assigns[:user_id] do
      token = Phoenix.Token.sign(conn, "user socket", current_user)
      assign(conn, :user_token, token)
    else
      require IEx
      IEx.pry
      conn
    end
  end
end
