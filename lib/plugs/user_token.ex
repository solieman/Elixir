defmodule ChatWeb.UserToken do
    @moduledoc """
    Generate a Phoenix Token for surrent User and assign to conn
    """
    import Plug.Conn, only: [assign: 3]

    def init(default), do: default

    def call(conn, _params) do
        case conn.assigns[:current_user] do
            nil ->
               conn

            user ->
                token = Phoenix.Token.sign(conn, "user socket", user.id)
                assign(conn, :user_token, token)
        end
    end
end