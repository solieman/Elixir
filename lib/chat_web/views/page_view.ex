defmodule ChatWeb.PageView do
  use ChatWeb, :view

  def title(conn) do
    case conn.assigns[:title] do
       nil -> "Awesome New Title!"
       title -> title 
    end
  end
end
