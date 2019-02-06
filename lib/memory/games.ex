defmodule Memory.Game do
   
   def new do
     %{
       score: 0,
       board: make_board(),
       matched: [],
       current: [],
       penalty: 0,
     }
   end
 
   def client_view(game) do
     %{
       score: game.score,
       player_board: viewable_board(game.board, game.matched, game.current)
     }
   end
  
   def viewable_board(board, matched, current) do 
     make_viewable_board(board, matched, current, 0)
   end

   def make_viewable_board(board, matched, current, index) when index == length(board), do: []
   def make_viewable_board(board, matched, current, index) do
     if (Enum.member?(current, index) || Enum.member?(matched, Enum.fetch!(board, index))) do
       [Enum.fetch!(board, index)] ++ make_viewable_board(board, matched, current, index + 1)
     else
       [""] ++ make_viewable_board(board, matched, current, index + 1)
     end
   end

   def flip(game, index) do
     {index, _} = Integer.parse(index)
     cr = game.current ++ [index]
     if (length(cr) >= 2) do
       evaluate(game, cr)
     else
       Map.put(game, :current, cr)
     end
   end

   def evaluate(game, current) do
     first = Enum.fetch!(current, 0)
     second = Enum.fetch!(current, 1)
     if (Enum.fetch!(game.board, first) == Enum.fetch!(game.board, second)) do
       game
       |> Map.put(:matched, game.matched ++ [Enum.fetch!(game.board, first)])
       |> Map.put(:current, [])
       |> Map.put(:score, game.score + max(100 - game.penalty * 10, 0))
       |> Map.put(:penalty, 0)
     else
       game
       |> Map.put(:current, [])
       |> Map.put(:penalty, game.penalty + 1)
     end
   end

   def make_board(), do: Enum.shuffle(make_board(num_faces()))
   def make_board(0), do: []
   def make_board(num), do: [<<64 + num>>] ++ [<<64 + num>>] ++ make_board(num - 1)
   def num_faces() do
     8
   end
end
