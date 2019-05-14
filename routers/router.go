package routers

import (
	"github.com/BlockchainZoo/spinechain-prototype/src/html/controllers"
	"github.com/astaxie/beego"
)

func init() {
	beego.Router("/", &controllers.MainController{})
	beego.Router("/dashboard", &controllers.MainController{}, "get:Dashboard")
	beego.Router("/sendmoney", &controllers.AccountController{}, "get:SendMoneyForm")
	beego.Router("/newaccount/", &controllers.AccountController{}, "get:AddAccountForm")
}
