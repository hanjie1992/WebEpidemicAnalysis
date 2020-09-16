$(function(){
	var schoolDiv = document.getElementById("validateCode");
	$.ajax({
        type : "get",
        async : true,    
        url : "http://127.0.0.1:8083/root/getSchoolList",    //请求发送
        data : {},
        dataType : "json",        //返回数据形式为json
        success : function(result) {
            if(result.errorCode!=""){
                return;
            }
            var data = result.school;
			var html = '<option value="0">请选择学校</option>';
			for(var i=0; i< data.length; i++){
				//console.log(data[i]);
                html += '<option value="'+data[i]+'">' + data[i] + '</option>';			
			}
			schoolDiv.innerHTML = html;
    
        },
        error : function(errorMsg) {
            //请求失败时执行该函数
            alert("请求数据失败!");
        
        }
    });

})

//登录按钮动作
function userLogin(){ 
    school =$('#validateCode').val();
    userName =$('#userName').val();
    password =$('#password').val();

    if(school==null || school=="0"){
        alert("请选择学校！");
        return;
    }else if(userName==null || userName==undefined || userName==""){
        alert("请填写用户名！");
        return;
    }else if(password==null || password==undefined|| password==""){
        alert("请输入密码！");
        return;
    }

	$.ajax({
        type : "get",
        async : true,    
        url : "http://127.0.0.1:8083/root/login?school="+school+'&usr='+userName+'&psw='+password,    //请求发送
        data : {},
        dataType : "json",        //返回数据形式为json
        success : function(result) {
            if(result.errorCode==4002){
                alert("登录失败");
                return;
            }else if(result.errorCode==0){
                var school = result.school;
                var url = result.url;
                window.location.href='index.html?school='+school+'&url=' + url;
            }			   
        },
        error : function(errorMsg) {
            //请求失败时执行该函数
            alert("请求数据失败!");
        
        }
    });
}