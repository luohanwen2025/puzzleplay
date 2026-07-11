"use strict";
const C3 = globalThis.C3;
{
	C3.Behaviors.ppstudio_parabolictween_beh.Acts =
	{
		SetEnabled(e){
			this._setEnabled(!e);
		},

		SetParabolaByVel(tag,velocity,angle,gravity){
			this._setOffset(tag,this.instance.x,this.instance.y);
			this._setParabolaByVel(tag,velocity,angle,gravity);
		},

		CalculateByTarget(tag,x,y,time,gravity){
			this._setOffset(tag,this.instance.x,this.instance.y);
			this._calculateByTarget(
					tag,
					x,
					y,
					gravity,
					time*this._factor);
		},

		async TweenParabola(tag,targetX,targetY,time,gravity,setAngle,destroy){
			this._setOffset(tag,this.instance.x,this.instance.y);
			this._setGravity(tag,gravity);
			this._tweens[tag]={
				"alive":true,
				"targetX":targetX,
				"targetY":targetY,
				"tweening":{},
				"time":time,
				"currentTime":0,
				"setAngle":setAngle,
				"destroy":destroy
			}

			return new Promise(
				(resolve)=>{
					let result=this._calculateByTarget(
						tag,
						this._tweens[tag]["targetX"],
						this._tweens[tag]["targetY"],
						this._parabolas[tag]["gravity"],
						this._tweens[tag]["time"]*this._factor,
						resolve);
					
					this._tweens[tag]["tweening"]=result;

					if (!this._isTicking())
						this._setTicking(true);
				}
			);
		},

		StopTweenParabola(tag){
			if (this._tweens[tag]!==undefined){
				this._tweens[tag]["alive"]=false;
				this._tweens[tag]["currentTime"]=this._tweens[tag]["time"];
				this._trigger(C3.Behaviors.ppstudio_parabolictween_beh.Cnds.OnTweeningParabolaFinished);
				this._trigger(C3.Behaviors.ppstudio_parabolictween_beh.Cnds.OnAnyTweeningParabolaFinished);
				if (this._tweens[tag]["destroy"])
					this.instance.destroy();
			}				
		},

		StopAllTweens(){
			let keys=Object.keys(this._tweens);
			keys.forEach(
				(tag)=>{
					this._tweens[tag]["alive"]=false;
					this._tweens[tag]["currentTime"]=this._tweens[tag]["time"];
					this._trigger(C3.Behaviors.ppstudio_parabolictween_beh.Cnds.OnTweeningParabolaFinished);
					this._trigger(C3.Behaviors.ppstudio_parabolictween_beh.Cnds.OnAnyTweeningParabolaFinished);
					if (this._tweens[tag]["destroy"])
						this.instance.destroy();
				}
			);
			
			if (this._isTicking())
				this._setTicking(false)
		},

		PauseTweenParabola(tag){
			if (this._tweens[tag]!==undefined){
				this._tweens[tag]["alive"]=false;
			}
		},

		PauseAllTweens(){
			let keys=Object.keys(this._tweens);
			keys.forEach(
				(tag)=>{
					this._tweens[tag]["alive"]=false;
				}
			);
			
			if (this._isTicking())
				this._setTicking(false)
		},

		SetGravityAngle(angle){
			this._adjangle = angle;
		},

		ResumeTweenParabola(tag){
			if (this._tweens[tag]!==undefined){
				this._tweens[tag]["alive"]=true;
				if (!this._isTicking())
					this._setTicking(true);
			}
		},

		ResumeAllTweens(){
			let keys=Object.keys(this._tweens);
			let keepAlive=false;
			keys.forEach(
				(tag)=>{
					if (this._tweens[tag]["currentTime"]<this._tweens[tag]["time"]);{
						keepAlive=true;
						this._tweens[tag]["alive"]=true;
					}
				}
			);

			if (!this._isTicking()&&keepAlive)
				this._setTicking(true);
		}
	};
}