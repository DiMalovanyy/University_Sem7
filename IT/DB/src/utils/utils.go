package utils


func MakeRange(min, max int) []interface{}{
    a := make([]interface{}, max-min+1)
    for i := range a {
        a[i] = min + i
    }
    return a
}
