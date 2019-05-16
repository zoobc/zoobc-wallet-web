package controllers

import (
	"github.com/astaxie/beego"
)

type MainController struct {
	beego.Controller
}

//Get is login page
func (main *MainController) Get() {
	main.Layout = "template/template_login.html"
	main.Data["title"] = "Login - Register"
	main.TplName = "default/login.html"
}

//Dashboard main dashboard
func (main *MainController) Dashboard() {
	main.Data["title"] = "Dashboard"
	main.Layout = "template/admin.html"
	main.TplName = "default/dashboard.tpl"
}
