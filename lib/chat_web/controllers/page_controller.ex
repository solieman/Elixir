defmodule ChatWeb.PageController do
  use ChatWeb, :controller

  def index(conn, _params) do
    user_id = get_session(conn, :user_id)

    if user_id === nil do
      import Ecto
      uuid = Ecto.UUID.generate
      conn = put_session(conn, :user_id, uuid)
      conn |> assign(:user_id, uuid)
      user_id = get_session(conn, :user_id)
    end

    render conn, "index.html",
      title: "Hello from the contoller"
  end
end