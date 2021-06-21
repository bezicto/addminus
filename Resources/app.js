//game font
var customFont = 'Eraser-Regular';
if(Ti.Platform.osname == 'android') {
    customFont = 'EraserRegular';
} 

//your game time up value, in seconds
var timeUpValue = 300;//default = 300

//images
var startUpImage = 'images/start.jpg';
var gameBackground = 'images/bg.jpg';
var buttonImage = 'images/button.png';
var buttonDarkImage = 'images/buttondark.png';
var calculatorBackground = 'images/calc.png';

//title and wording
if(Ti.Platform.osname == "android")
	{var gameTitle = 'plusMINUS';}
else
	{var gameTitle = 'addMINUS';}
var loadingWord = 'Loading...';
var startWord = 'Start';
var achievementWord = 'Achievement';
var levelWord = 'Level';
var timeUpWord = "Time's up!";
var wrongWord = "Wrong !";
	
//font color
var startWordColor = 'cyan';
var achievementWordColor = 'white';
var levelWordColor = 'white';
var wrongWordColor = 'red';
var timerFontColor = 'green';
var calcNumberFontColor = 'black';
var calcNumberFontColorTouch = 'white';
var calcOtherFontColor = 'white';
var calcOtherFontColorTouch = 'black';
var firstNumberFontColor = 'white';
var operatorAndSecondNumberFontColor = 'yellow';
var typedAnswerFontColor = 'white';
var historyFontColor = 'pink';

//multiplier tier
var multi_001_010 = 11;
var multi_011_025 = 31;
var multi_026_050 = 51;
var multi_051_075 = 101;
var multi_076_100 = 251;
var multi_101_250 = 501;
var multi_251_500 = 1001;
var multi_501_beyond = 9991;

//test multiplier tier
/*var multi_001_010 = 1;
var multi_011_025 = 1;
var multi_026_050 = 1;
var multi_051_075 = 1;
var multi_076_100 = 1;
var multi_101_250 = 1;
var multi_251_500 = 1;
var multi_501_beyond = 1;*/

//save highest level integer in plain text
function saveLevel(saveLevel)
	{
		var myFile = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory,'save.txt');
    	myFile.write(saveLevel);
	}

//read the highest level integer and will display it on screen later
function readLevel()
	{
		var readContents;
		var myFile = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory,'save.txt');  
		if (myFile.exists()) 
		{
    		readContents = myFile.read(); 		
			if (readContents.text == '')
				return '0';
			else	
				return readContents.text;
		}      
		else
		{
			return '0';
		} 		
	}

//create the main Window and its core functions when user tap on the android back button and when the game loaded (open)
var startWindow = Titanium.UI.createWindow({title:gameTitle,navBarHidden:true,fullscreen:true,modal: true,backgroundColor: 'black',backgroundImage:startUpImage,});
	startWindow.orientationModes=[Titanium.UI.PORTRAIT];
	startWindow.addEventListener('androidback', function(e) 
	{
		startWindow.close();
     	var activity = Titanium.Android.currentActivity;
     	activity.finish();
	});	
	startWindow.addEventListener('open', function(e) 
	{				
		//put this on open to refresh current user achievement
		startText.text = startWord;		
		highLevelText.text = achievementWord+': '+levelWord+' '+readLevel();
	});	

//create startButton view as the placeholder for the Start text
var startButton = Ti.UI.createView({layout:'vertical', bottom:'20dp',width:Ti.UI.SIZE,height:Ti.UI.SIZE,});

//create Start text and its function
var startText = Ti.UI.createLabel({top:'10dp', text:startWord, color:startWordColor,height:'auto',width:'auto',font:{fontSize: '22sp',fontWeight:'bold',fontFamily:customFont,textAlign:'center'},});
	startText.addEventListener('click', function(e) 
	{		
		startText.text = loadingWord;
		startWindow.close();
		
		//play.js start -------------------------------------------------------------------------------------------------------------------
		//timer codes started
		function niceTimeFromMilliseconds(ms)
		{
		    var total_seconds = ms / 1000;
		    var minutes = Math.floor(total_seconds / 60);
		    var seconds = total_seconds - (minutes * 60) - 0.499;
		    //499miliseconds subtracted before rounding up in the interest of accuracy
		 
		    if (minutes < 10 && seconds < 9) {
		        return "0" + minutes + ":" + "0" + Math.round(seconds);
		    }
		    if (minutes < 10 && seconds > 9) {
		        return "0" + minutes + ":" + Math.round(seconds);
		    }if (seconds < 9) {
		        return minutes + ":" + "0" + Math.round(seconds);
		    }  
		    return  minutes + ":" + Math.round(seconds);
		}
		var start = new Date().getTime();
		var timerlabel = Ti.UI.createLabel({
		    text: "00:00",
		    height:Ti.UI.SIZE,
		    width:Ti.UI.SIZE,
		    font:{fontSize: '20sp',fontFamily:customFont,textAlign:'center'},
		    color:timerFontColor,
		});
		var timerUp = setInterval(function() {
		    var newTime = new Date().getTime();
		    timerlabel.text = niceTimeFromMilliseconds( newTime - start );
		}, 1000);
		//timer code ended
	
		var n = 1;
		var operators = Array('+','-');
		var randomoperator = '+';
		var timeUpValue_edited = (timeUpValue + 1)*1000;//add one second and then multiply by 1000 to get it as miliseconds
		
		//timer usage
		var timer = setTimeout(function(){
						e3.width = "80%";
						lanswer.color = "pink";
						lanswer.font = {fontSize: '70sp',fontFamily:customFont,textAlign:'center'};
							timerlabel.hide();
							e1.hide();
							e2.hide();
							lg31.hide();
							lg32.hide();
						//lanswer.text = timeUpWord;
						calculatorView.hide();
						timerlabel.hide();
						
						if (screenHeight >= 736 && Titanium.Platform.osname == 'iphone')
							{
							//for iphone 6 plus only
							mainWindow.remove(historyWindow);
							}
								
						var dialog = Ti.UI.createAlertDialog({
		    				cancel: 0,
		    				buttonNames: ['I will try again'],
		    				message: '',
		    				title: timeUpWord
		  				});
		  				dialog.addEventListener('click', function(e){
		    				if (e.index === e.source.cancel){
		      					clearTimeout(timer);
								mainWindow.close();
								startWindow.open();
								if (n >= parseInt(readLevel()))
									saveLevel(""+n-1);
		    				}
		   				});
		  				dialog.show(); 	
					}, timeUpValue_edited);
		
		//main game window and its android back button function and after user end any touch event on the screen
		var mainWindow = Titanium.UI.createWindow({title:gameTitle,navBarHidden:true,fullscreen:true,layout:'vertical',modal: true,backgroundColor: 'black',backgroundImage:gameBackground,});
			mainWindow.orientationModes=[Titanium.UI.PORTRAIT];	
			mainWindow.addEventListener('androidback', function(e) 
			{	
				clearTimeout(timer);
				mainWindow.close();
				startWindow.open();
				if (n >= parseInt(readLevel()))
					saveLevel(""+n-1); 
			});
			mainWindow.addEventListener('touchend', function(e) 
			{	
				setTimeout(function() {
					anum1.color=calcNumberFontColor;
					anum2.color=calcNumberFontColor;
					anum3.color=calcNumberFontColor;
					anum4.color=calcNumberFontColor;
					anum5.color=calcNumberFontColor;
					anum6.color=calcNumberFontColor;
					anum7.color=calcNumberFontColor;
					anum8.color=calcNumberFontColor;
					anum9.color=calcNumberFontColor;
					anum0.color=calcNumberFontColor;
					anumC.color=calcOtherFontColor;
					checkButtonLabel.color=calcOtherFontColor;
				},250);
				
			});
		
		//level label
		var level = Ti.UI.createLabel({top:'5dp', text:levelWord+' 1', color:levelWordColor,height:Ti.UI.SIZE,width:Ti.UI.SIZE,font:{fontSize: '20sp',fontFamily:customFont,textAlign:'center'},});
		
		//e1 view that display first number to be added	
		var e1 = Ti.UI.createView({top:'20dp',width:'50%',height:Ti.UI.SIZE,});//top default is 10dp
		var le1 = Ti.UI.createLabel({right:'10dp',text:'1', color:firstNumberFontColor,height:'auto',width:'auto',font:{fontSize: '25sp',fontFamily:customFont,textAlign:'center'},});
			e1.add(le1);
		
		var randomnumber=Math.floor(Math.random()*11);
		var multiplier = 11;
		
		//e2 view that display an operator either plus or minus and a second number to be added with the first number above	
		var e2 = Ti.UI.createView({top:'5dp', width:'50%',height:Ti.UI.SIZE,});
		var lo2 = Ti.UI.createLabel({left:'10dp', text:randomoperator, color:operatorAndSecondNumberFontColor,font:{fontSize: '40sp',fontFamily:customFont,textAlign:'center'},});
		var le2 = Ti.UI.createLabel({right:'10dp', text:randomnumber, color:operatorAndSecondNumberFontColor,font:{fontSize: '25sp',fontFamily:customFont,textAlign:'center'},});
			e2.add(lo2);
			e2.add(le2);
		
		//lg31 and lg32 are the horizontal bars that in between will display lanswer (answer that user type using the numeric keypad)	
		var e3 = Ti.UI.createView({layout:'vertical', top:'5dp', width:'50%',height:Ti.UI.SIZE,});
		var lg31 = Ti.UI.createView({width:'100%',height:'2dp', backgroundColor:'white'});
		var lanswer = Ti.UI.createLabel({text:'', right:'10dp', color:typedAnswerFontColor,font:{fontSize: '25sp',fontFamily:customFont,textAlign:'center'},});
		var lg32 = Ti.UI.createView({width:'100%',height:'2dp', backgroundColor:'white'});
			e3.add(lg31);
			e3.add(lanswer);
			e3.add(lg32);	
		
		//create numeric keypad view as the container for buttons
		var calculatorView = Ti.UI.createView({layout:'vertical', top:'10dp', backgroundImage:calculatorBackground, width:'220dp',height:Ti.UI.SIZE,});
		
		//--calculator view start
		var numrow1 = Ti.UI.createView({layout:'horizontal', top:'10dp', borderWidth:'0dp', width:Ti.UI.SIZE, height:Ti.UI.SIZE});
			var num1 = Ti.UI.createView({backgroundImage:buttonImage, width:'50dp',height:'50dp'});
				var anum1 = Ti.UI.createLabel({text:'1', color:calcNumberFontColor,font:{fontSize: '20sp',fontWeight:'bold',fontFamily:'Helvetica Neue',textAlign:'center'},});
				num1.add(anum1);
			var num2 = Ti.UI.createView({backgroundImage:buttonImage, left:'10dp', width:'50dp',height:'50dp'});
				var anum2 = Ti.UI.createLabel({text:'2', color:calcNumberFontColor,font:{fontSize: '20sp',fontWeight:'bold',fontFamily:'Helvetica Neue',textAlign:'center'},});
				num2.add(anum2);
			var num3 = Ti.UI.createView({backgroundImage:buttonImage, left:'10dp', width:'50dp',height:'50dp'});
				var anum3 = Ti.UI.createLabel({text:'3', color:calcNumberFontColor,font:{fontSize: '20sp',fontWeight:'bold',fontFamily:'Helvetica Neue',textAlign:'center'},});
				num3.add(anum3);
			numrow1.add(num1);numrow1.add(num2);numrow1.add(num3);
			num1.addEventListener('touchstart', function(e) {lanswer.text = lanswer.text + anum1.text;});
			num2.addEventListener('touchstart', function(e) {lanswer.text = lanswer.text + anum2.text;});
			num3.addEventListener('touchstart', function(e) {lanswer.text = lanswer.text + anum3.text;});
			
		var numrow2 = Ti.UI.createView({layout:'horizontal', top:'5dp', borderWidth:'0dp', width:Ti.UI.SIZE, height:Ti.UI.SIZE});
			var num4 = Ti.UI.createView({backgroundImage:buttonImage, width:'50dp',height:'50dp'});
				var anum4 = Ti.UI.createLabel({text:'4', color:calcNumberFontColor,font:{fontSize: '20sp',fontWeight:'bold',fontFamily:'Helvetica Neue',textAlign:'center'},});
				num4.add(anum4);
			var num5 = Ti.UI.createView({backgroundImage:buttonImage, left:'10dp', width:'50dp',height:'50dp'});
				var anum5 = Ti.UI.createLabel({text:'5', color:calcNumberFontColor,font:{fontSize: '20sp',fontWeight:'bold',fontFamily:'Helvetica Neue',textAlign:'center'},});
				num5.add(anum5);
			var num6 = Ti.UI.createView({backgroundImage:buttonImage, left:'10dp', width:'50dp',height:'50dp'});
				var anum6 = Ti.UI.createLabel({text:'6', color:calcNumberFontColor,font:{fontSize: '20sp',fontWeight:'bold',fontFamily:'Helvetica Neue',textAlign:'center'},});
				num6.add(anum6);
			numrow2.add(num4);numrow2.add(num5);numrow2.add(num6);
			num4.addEventListener('touchstart', function(e) {lanswer.text = lanswer.text + anum4.text;});
			num5.addEventListener('touchstart', function(e) {lanswer.text = lanswer.text + anum5.text;});
			num6.addEventListener('touchstart', function(e) {lanswer.text = lanswer.text + anum6.text;});
		
		var numrow3 = Ti.UI.createView({layout:'horizontal', top:'5dp', borderWidth:'0dp', width:Ti.UI.SIZE, height:Ti.UI.SIZE});
			var num7 = Ti.UI.createView({backgroundImage:buttonImage, width:'50dp',height:'50dp'});
				var anum7 = Ti.UI.createLabel({text:'7', color:calcNumberFontColor,font:{fontSize: '20sp',fontWeight:'bold',fontFamily:'Helvetica Neue',textAlign:'center'},});
				num7.add(anum7);
			var num8 = Ti.UI.createView({backgroundImage:buttonImage, left:'10dp', width:'50dp',height:'50dp'});
				var anum8 = Ti.UI.createLabel({text:'8', color:calcNumberFontColor,font:{fontSize: '20sp',fontWeight:'bold',fontFamily:'Helvetica Neue',textAlign:'center'},});
				num8.add(anum8);
			var num9 = Ti.UI.createView({backgroundImage:buttonImage, left:'10dp', width:'50dp',height:'50dp'});
				var anum9 = Ti.UI.createLabel({text:'9', color:calcNumberFontColor,font:{fontSize: '20sp',fontWeight:'bold',fontFamily:'Helvetica Neue',textAlign:'center'},});
				num9.add(anum9);
			numrow3.add(num7);numrow3.add(num8);numrow3.add(num9);
			num7.addEventListener('touchstart', function(e) {lanswer.text = lanswer.text + anum7.text;});
			num8.addEventListener('touchstart', function(e) {lanswer.text = lanswer.text + anum8.text;});
			num9.addEventListener('touchstart', function(e) {lanswer.text = lanswer.text + anum9.text;});
		
		var numrow4 = Ti.UI.createView({layout:'horizontal', top:'5dp', borderWidth:'0dp', width:Ti.UI.SIZE, height:Ti.UI.SIZE});
			var numC = Ti.UI.createView({backgroundImage:buttonDarkImage, width:'50dp',height:'50dp'});
				var anumC = Ti.UI.createLabel({text:'CA', color:calcOtherFontColor,font:{fontSize: '20sp',fontWeight:'bold',fontFamily:'Helvetica Neue',textAlign:'center'},});
				numC.add(anumC);
			var num0 = Ti.UI.createView({backgroundImage:buttonImage, left:'10', width:'50dp',height:'50dp'});
				var anum0 = Ti.UI.createLabel({text:'0', color:calcNumberFontColor,font:{fontSize: '20sp',fontWeight:'bold',fontFamily:'Helvetica Neue',textAlign:'center'},});
				num0.add(anum0);
			var checkButton = Ti.UI.createView({backgroundImage:buttonDarkImage, left:'10dp', width:'50dp',height:'50dp'});
				var checkButtonLabel = Ti.UI.createLabel({text:'=', color:calcOtherFontColor,font:{fontSize: '20sp',fontWeight:'bold',fontFamily:'Helvetica Neue',textAlign:'center'},});
				checkButton.add(checkButtonLabel);
			numrow4.add(numC);numrow4.add(num0);numrow4.add(checkButton);
			num0.addEventListener('touchstart', function(e) {lanswer.text = lanswer.text + anum0.text;});
			numC.addEventListener('touchstart', function(e) {lanswer.text = '';});	
		    checkButton.addEventListener('touchstart', function(e) {
				//checkButtonLabel.color=calcOtherFontColorTouch;	
				if (lo2.text == '+')
					var totalCheck = parseInt(le1.text) + parseInt(le2.text);
				else if (lo2.text == '-')
					var totalCheck = parseInt(le1.text) - parseInt(le2.text);
					
				//check for answer that user typed on screen
				if (lanswer.text != '')
				{
					if (screenHeight >= 736 && Titanium.Platform.osname == 'iphone')
					{
							//for iphone 6 plus only
							historyLabel.text = historyLabel.text + ' ' + lo2.text + ' ' + le2.text;//baru tambah untuk show history bg ip6plus
							historyWindow.scrollToBottom();
					}	
						
					if (parseInt(lanswer.text) == totalCheck)
					{			
						le1.text = totalCheck;
					
						if (n <= 10)
							multiplier = multi_001_010;
						else if (n <= 25)
							multiplier = multi_011_025;
						else if (n <= 50)
							multiplier = multi_026_050;
						else if (n <= 75)
							multiplier = multi_051_075;
						else if (n <= 100)
							multiplier = multi_076_100;
						else if (n <= 250)
							multiplier = multi_101_250;
						else if (n <= 500)
							multiplier = multi_251_500;
						else
							multiplier = multi_501_beyond;
						
						le2.text = Math.floor(Math.random()*multiplier);
					
						randomoperator = operators[Math.floor(Math.random()*operators.length)];
						if ((randomoperator == '-') && (parseInt(le1.text) < parseInt(le2.text)))
							lo2.text = '+';
						else
							lo2.text = randomoperator;	
		
						lanswer.text = '';
					
						if (n >= parseInt(readLevel()))
							saveLevel(""+n);
						n=n+1;
						level.text = levelWord+' '+n;			
					}
					else
					{
		  				if (screenHeight >= 736 && Titanium.Platform.osname == 'iphone')
						{
							//for iphone 6 plus only
							historyLabel.text = historyLabel.text + ' \u2260 ' + lanswer.text;//baru tambah untuk show history bg ip6plus
							historyWindow.scrollToBottom();
						}	
		  				timerlabel.hide();
		  				calculatorView.hide();
		  				lanswer.color = wrongWordColor;
						//lanswer.text = wrongWord;
		  				if (n >= parseInt(readLevel())) saveLevel(""+n-1);	  				
		  				
		  				//replacement for dialog above
		  				mainWindow.remove(calculatorView);
		  				var restartView = Ti.UI.createView({layout:'vertical', borderWidth:'0dp', bottom:'20dp'});
						var restartWrongLabel = Ti.UI.createLabel({top:'15dp',text:'Wrong answer!', color:wrongWordColor,font:{fontSize: '25sp',fontFamily:customFont,textAlign:'center'},});
						var restartLabel = Ti.UI.createLabel({text:'Restart', color:startWordColor,font:{fontSize: '15sp',fontFamily:customFont,textAlign:'center'},});
						mainWindow.add(restartView);
						restartView.add(restartWrongLabel);
						restartView.add(restartLabel);
						restartView.addEventListener('click', function(e){    				
		      					clearTimeout(timer);
								mainWindow.close();
								startWindow.open();
								if (n >= parseInt(readLevel()))
									saveLevel(""+n-1);
		   				});
		  				
		  				//lanswer.text = '';							
					}
				}			
			});
		
		//numrow5 will insert a blank space of 10dp heights to give the on screen calculator a nice bottom	
		var numrow5 = Ti.UI.createView({layout:'horizontal', borderWidth:'0dp', width:'200dp', height:'10dp'});
		//--calculator view end
		
		mainWindow.add(level);
		mainWindow.add(timerlabel);
		
		var screenHeight = Titanium.Platform.displayCaps.platformHeight;
		if (screenHeight >= 736 && Titanium.Platform.osname == 'iphone')
		{
			//below codes is for iphone 6 plus only
			var historyWindow = Ti.UI.createScrollView({showVerticalScrollIndicator: true, layout:'vertical', borderWidth:'0dp', top:'10dp', width:'95%', height:'30%'});
			var historyLabel = Ti.UI.createLabel({top:'15dp',text:'1', color:historyFontColor,height:'auto',font:{fontSize: '25sp',fontFamily:customFont,textAlign:'center'},});
			mainWindow.add(historyWindow);
			historyWindow.add(historyLabel);
		}
		
		mainWindow.add(e1);
		mainWindow.add(e2);
		mainWindow.add(e3);
			calculatorView.add(numrow1);
			calculatorView.add(numrow2);
			calculatorView.add(numrow3);
			calculatorView.add(numrow4);
			calculatorView.add(numrow5);
		mainWindow.add(calculatorView);

		//play.js end ------------------------------------------------------------------------------------------------------------------------------------------
		mainWindow.open();		
	});
	startButton.add(startText);

//display highest level achievement
var highLevelText = Ti.UI.createLabel({top:'10dp', text:achievementWord+': '+levelWord+' '+readLevel(),color:achievementWordColor,height:'auto',width:'auto',font:{fontSize: '16sp',fontWeight:'bold',fontFamily:customFont,textAlign:'center'},});
	startButton.add(highLevelText);
	
//add startButton view on the main Window
startWindow.add(startButton);

//open the main Window
startWindow.open();