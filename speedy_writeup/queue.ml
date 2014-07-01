exception Empty;

type 'a queue = 'a list * 'a list
          
let push (q : 'a queue) (x : 'a) : 'a queue =
  match q with
  | [], back -> x::[], back
  | front, back -> front, x::back

let pop (q : 'a queue) : 'a queue * 'a = 
  match q with
  | [], _ -> raise Empty
  | x::[], back -> ((List.rev back, []), x)
  | x::xs, back -> ((xs, back), x)
