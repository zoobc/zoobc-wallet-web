package main

import (
	_ "github.com/BlockchainZoo/spinechain-web-wallet-prototype/routers"
	"github.com/astaxie/beego"
)

func main() {
	apiurl := beego.AppConfig.String("apiurl")
	println(apiurl)
	beego.Run()
}
