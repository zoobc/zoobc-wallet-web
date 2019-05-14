package routers

import (
	"github.com/BlockchainZoo/spinechain-prototype/src/html/controllers"
	"github.com/astaxie/beego"
)

func init() {
	beego.Router("/", &controllers.MainController{})
	beego.Router("/dashboard", &controllers.MainController{}, "get:Dashboard")
	beego.Router("/sendmoney", &controllers.AccountController{}, "get:SendMoneyForm")
	beego.Router("/sendmessage", &controllers.AccountController{}, "get:SendMessageForm")
	beego.Router("/transferhistory", &controllers.AccountController{}, "get:TransferHistoryTable")
	beego.Router("/blocks", &controllers.SettingController{}, "get:BlockList")
}
