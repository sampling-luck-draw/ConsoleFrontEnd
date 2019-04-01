package main

import (
	"fmt"
	"os"
)

func main() {
	var s string
	fmt.Scanln(&s)
	fmt.Println(s)
	os.Exit(0)
}
