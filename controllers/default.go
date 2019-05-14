package controllers

import (
	"github.com/astaxie/beego"
)

type MainController struct {
	beego.Controller
}

//Get ...
func (c *MainController) Get() {
	c.Data["Website"] = "spinechain.go"
	c.Data["Email"] = "admin@spineshain.com"
	c.TplName = "index.tpl"
}

func (main *MainController) Dashboard() {
	main.Layout = "admin.html"
	main.Data["Website"] = "My Website"
	main.Data["Email"] = "your.email.address@example.com"
	main.Data["EmailName"] = "Your Name"
	main.TplName = "default/dashboard.tpl"
}
