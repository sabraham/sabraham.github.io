(defn push
  [[[hd & tl :as front] back] x]
  (if-not hd
    (list (list x) back)
    (list front (conj back x))))

(defn pop
  [[[hd & tl :as front] back]]
  (if-not hd
    (throw (Exception. "Empty"))
    (if-not tl
      (list (list (reverse back) (list)) hd)
      (list (list tl back) hd))))
