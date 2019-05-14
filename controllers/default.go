package controllers

import (
	"github.com/astaxie/beego"
)

type MainController struct {
	beego.Controller
}

//Get is login page
func (main *MainController) Get() {
	main.Data["title"] = "Login - Register"
	main.TplName = "index.tpl"
}

//Dashboard main dashboard
func (main *MainController) Dashboard() {
	main.Data["title"] = "Dashboard"
	main.Layout = "admin.html"
	main.TplName = "default/dashboard.tpl"
}
