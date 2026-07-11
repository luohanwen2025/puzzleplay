"use strict";
const C3 = globalThis.C3;
{
	const C3=self.C3;
	C3.Behaviors.ppstudio_parabolictween_beh.Instance = class ppstudio_parabolictween_beh_Instance extends globalThis.ISDKBehaviorInstanceBase
	{
		constructor()
		{
			super();
			const properties = this._getInitProperties();
			if (properties){
				let idx=0;
				this._isEnabled = properties[idx++];
				this._adjangle = properties[idx++];
				this._factor = globalThis["ParabolicShot"]["FACTOR"];
			}
			this._resolvers={};
			this._parabolicShots={};
			this._parabolas={};
			this._tweens={};
			this._currentTagTriggered="";
		}

		_setEnabled(e){
			this._isEnabled=e;
			if (!this._isTicking())
				this._setTicking(true);
		}

		_checkParabolaObject(gravity){
			if (!this._parabolicShots.hasOwnProperty(gravity))
				this._parabolicShots[gravity]=new globalThis["ParabolicShot"](gravity);
			
			this._parabolicShots[gravity]["setOffsetAngle"](this._adjangle);
		}

		_projectileAngle(tag,time){
			if (this._parabolas[tag]==undefined)
				return 0;

			let angle=
				this._parabolas[tag].object["getAngleAt"](
					{
						x:this._tweens[tag]["tweening"]["vx"],
						y:this._tweens[tag]["tweening"]["vy"]
					},
					time*this._factor);

			return -angle<0?-angle+360:-angle;
		}

		_initParabolaObject(tag,velocity,angle,gravity){
			const v=this._parabolicShots[gravity]["getVectorComponents"](velocity,angle);

			if (this._parabolas[tag]===undefined)
				this._parabolas[tag]={
					"object":this._parabolicShots[gravity],
					"velocity":velocity,
					"vx":v.x,
					"vy":v.y,
					"offsetX":0,
					"offsetY":0,
					"angle":angle,
					"gravity":gravity
				};
			else {
				this._parabolas[tag]["object"]=this._parabolicShots[gravity];
				this._parabolas[tag]["velocity"]=velocity;
				this._parabolas[tag]["vx"]=v.x;
				this._parabolas[tag]["vy"]=v.y;
				this._parabolas[tag]["angle"]=angle;
				this._parabolas[tag]["gravity"]=gravity;
			}
			this._parabolicShots[gravity]["setOffsetAngle"](this._adjangle);
		}

		_setOffset(tag,x,y){
			if (this._parabolas[tag]===undefined){
				this._checkParabolaObject(10); //default gravity is 10
				this._initParabolaObject(tag,0,0,10); 
			}
			
			this._parabolas[tag]["offsetX"]=x;
			this._parabolas[tag]["offsetY"]=y;
		}

		_setParabolaByVel(tag,velocity,angle,gravity){
			this._checkParabolaObject(gravity);
			this._initParabolaObject(tag,velocity/this._factor,angle,gravity);
		}

		_setGravity(tag,gravity){
			if (this._parabolas[tag]===undefined){
				this._checkParabolaObject(gravity);
				this._initParabolaObject(tag,0,0,gravity);
			}

			this._parabolas[tag]["object"]=this._parabolicShots[gravity];
			this._parabolas[tag]["gravity"]=gravity;		
		}

		_calculateByTarget(tag,x,y,gravity,time,resolveCallback){
			this._checkParabolaObject(gravity);

			this._resolvers[tag]=resolveCallback;

			if (this._parabolas[tag]===undefined){
				this._initParabolaObject(tag,0,0,gravity);
			}
			
			const initialState=this._parabolicShots[gravity]["getByTarget"](
				{
					x:x-this._parabolas[tag]["offsetX"], //Inverting the coordinates to fit Construct 3 rendering
					y:this._parabolas[tag]["offsetY"]-y
				},
				time
			);

			this._initParabolaObject(tag,initialState["velocity"],initialState["angle"],gravity);
			
			return initialState;
		}

		_getXAt(tag,time){
			if (this._parabolas[tag]==undefined)
				return 0;

			return this._parabolas[tag].object["getXAt"](
				this._parabolas[tag].object["getVectorComponents"](
					this._parabolas[tag]["velocity"],
					-this._parabolas[tag]["angle"]
				),
				time
			)+this._parabolas[tag]["offsetX"];			
		}

		_getYAt(tag,time){
			if (this._parabolas[tag]==undefined)
				return 0;

			return -this._parabolas[tag].object["getYAt"](
				this._parabolas[tag].object["getVectorComponents"](
					this._parabolas[tag]["velocity"],
					-this._parabolas[tag]["angle"]
				),
				time
			)+this._parabolas[tag]["offsetY"];			
		}

		_tick(){
			let keys=Object.keys(this._tweens);
			let keepAlive=false;

			if (!this._isEnabled){
				this._setTicking(false);
				return;
			}

			keys.forEach(
				(tag)=>{
					if (this._tweens[tag]["alive"]){
						if (this._parabolas[tag]==undefined)
						{
							this._checkParabolaObject(10);
							this._initParabolaObject(tag,0,0,10);
						}

						this._setParabolaByVel(
								tag,
								this._tweens[tag]["tweening"]["velocity"]*this._factor,
								this._tweens[tag]["tweening"]["angle"],
								this._parabolas[tag]["gravity"]
								);

						this._currentTagTriggered=tag;
						this.instance.x=this._getXAt(tag,this._tweens[tag]["currentTime"]*this._factor);
						this.instance.y=this._getYAt(tag,this._tweens[tag]["currentTime"]*this._factor);

						if (this._tweens[tag]["setAngle"]){
							let angle=
								this._parabolas[tag].object["getAngleAt"](
										{
											x:this._tweens[tag]["tweening"]["vx"],
											y:this._tweens[tag]["tweening"]["vy"]
										},
										this._tweens[tag]["currentTime"]*this._factor);

							this.instance.angle=C3.toRadians(-angle);
						}

						keepAlive=true;
						if (this._tweens[tag]["currentTime"]<=this._tweens[tag]["time"])
							this._tweens[tag]["currentTime"]+=this.instance.dt;
						else if (this._tweens[tag]["alive"]){
							this._tweens[tag]["alive"]=false;
							this._tweens[tag]["currentTime"]=this._tweens[tag]["time"];
							this.instance.x=this._tweens[tag]["targetX"];
							this.instance.y=this._tweens[tag]["targetY"];
							
							if (this._resolvers[tag]!==undefined)
								this._resolvers[tag]();
							this._trigger(C3.Behaviors.ppstudio_parabolictween_beh.Cnds.OnTweeningParabolaFinished);
							this._trigger(C3.Behaviors.ppstudio_parabolictween_beh.Cnds.OnAnyTweeningParabolaFinished);
							if (this._tweens[tag]["destroy"])
								this.instance.destroy();
						}
					}
					
				}
			);

			if (!keepAlive)
				this._setTicking(false);
		}

		_release()
		{
			super._release();
		}
		
		_saveToJson()
		{
			return {
				"gravityAngle":this._adjangle,
				"isEnabled":this._isEnabled,
				"factor":this._factor = this._factor,
				"parabolas":this._parabolas,
				"tweens":this._tweens,
				"currentTagTriggered":this._currentTagTriggered
			};
		}

		_loadFromJson(o)
		{
				this._isEnabled=o["isEnabled"];
				this._adjangle=o["gravityAngle"];
				this._factor=o["factor"];
				this._tweens=o["tweens"];
				this._currentTagTriggered=o["currentTagTriggered"]

				let par=Object.keys(o["parabolas"]);
				par.forEach(
					(k)=>{
						this._setGravity(k,o["parabolas"][k]["gravity"]);						
						this._initParabolaObject(k,o["parabolas"][k]["velocity"],o["parabolas"][k]["angle"],o["parabolas"][k]["gravity"]);
						this._parabolas[k]["offsetX"]=o["parabolas"][k]["offsetX"];
						this._parabolas[k]["offsetY"]=o["parabolas"][k]["offsetY"];
					}
				);

				let keys=Object.keys(this._tweens);
				let keepAlive=false;
				keys.forEach(
					(tag)=>{
						if (this._tweens[tag]["alive"])
							keepAlive=true
					}
				);
				if (keepAlive)
					this._setTicking(true);

		}

		_getDebuggerProperties(){
			const prefix = "behaviors.ppstudio_parabolictween_beh.debugger.";
			let keys=Object.keys(this._parabolas);
			const values=[
				{
					title:"behaviors.ppstudio_parabolictween_beh.name",
					properties:[
					{name: prefix+"enabled", value: this._isEnabled, onedit:e=>{this._setEnabled(e)}},
					{name: prefix+"gravity-angle", value: this._adjangle, onedit:(v)=>{this._adjangle=v}}
					]
				}
			];

			keys.forEach(
				tag=>{
					let tweenProps=[];
					if (this._tweens[tag]!==undefined){
						tweenProps.push({name: prefix+"is-tweening", value: this._tweens[tag]["alive"]?this._tweens[tag]["alive"]:false});
						tweenProps.push({name: prefix+"time", value: this._tweens[tag]["time"]});
						tweenProps.push({name: prefix+"current-time", value: this._tweens[tag]["currentTime"]});
						tweenProps.push({name: prefix+"projectile-angle", value: this._projectileAngle(tag,this._tweens[tag]["currentTime"]*this._factor)});
					}
					const obj=this._parabolas[tag]["object"];
						
					values.push(
						{
							title: "Parabolic Tween:"+tag,
							properties:[
								{name: prefix+"velocity", value: this._parabolas[tag]["velocity"]},
								{name: prefix+"velocity-x", value: this._parabolas[tag]["vx"]},
								{name: prefix+"velocity-y", value: this._parabolas[tag]["vy"]},
								{name: prefix+"angle", value: this._parabolas[tag]["angle"]},
								{name: prefix+"gravity", value: obj!==undefined?obj["getGravity"]():0}
							]
						}
					);
					values[values.length-1].properties=values[values.length-1].properties.concat(tweenProps);
				}
			);
			return values;
		}
	};
}