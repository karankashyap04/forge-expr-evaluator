#lang forge

sig Cell {}

one sig Grid {
    cells : set Int->Int->Cell
}

pred wellformed {
    all i, j : Int | {
        some (Grid.cells[i][j]) iff (i >= 0 and i < 3 and j >= 0 and j < 3)

    }

    // Each cell slot must have exactly one unique cell
    all i, j : Int | 
        (i >= 0 and i < 3 and j >= 0 and j < 3) implies 
        (one c : Cell | Grid.cells[i][j] = c)

    // No two different slots share the same cell
    all i1, j1, i2, j2 : Int | 
        (i1 >= 0 and i1 < 3 and j1 >= 0 and j1 < 3 and 
         i2 >= 0 and i2 < 3 and j2 >= 0 and j2 < 3 and 
         (i1 != i2 or j1 != j2)) implies 
        (Grid.cells[i1][j1] != Grid.cells[i2][j2])
}

fun row[c : Cell] : Int {
    // Get the row index of the cell
    { i : Int | 
        some j : Int | Grid.cells[i][j] = c
    }
}

run {wellformed} for exactly 9 Cell