class PObj{
	constructor(m,r,color,bounciness=1,friction=0){
		this.m=m;
		this.r=r;
		this.color=color;
		this.rshow=r+2;
		this.bounciness=bounciness;
		this.friction=friction;
		
		this.pos=new V3();
		this.v=new V3();
		this.a=new V3();
	}
	isCollidingWith(o,r,vthis,vo){
		if(o instanceof PObj){
			r=o.pos.sub(this.pos);
			if(r.length>this.r+o.r)return false;
			r=r.normalize();
			vthis=this.v.dot(r);
			vo=o.v.dot(r);
			
			if(vthis>0&&vo>0&&abs(vthis)>abs(vo))return true;
			else if(vthis<0&&vo<0&&abs(vthis)<abs(vo))return true;
			else if(vthis>0&&vo<0)return true;
		}
		return false;
	}
	collidingBorder(){
		if(this.v.x<0&&this.pos.x-this.r<-can.width/2)return "xl";
		else if(this.v.x>0&&this.pos.x+this.r>can.width/2)return "xr";
		else if(this.v.y>0&&this.pos.y+this.r>can.height/2)return "yd";
		else if(this.v.y<0&&this.pos.y-this.r<-can.height/2)return "yt";
	}
	conserveMomentumWall(wtb,wtf){
		wtb=wall.bounciness*this.bounciness;
		//wtf=(1-wall.friction)*(1-this.friction);
		wtf=1-wall.friction*this.friction;
		switch(this.collidingBorder()){
			case "xl":this.v.x=abs(this.v.x)*wtb;this.v.y*=wtf;break;
			case "xr":this.v.x=-abs(this.v.x)*wtb;this.v.y*=wtf;break;
			case "yt":this.v.y=abs(this.v.y)*wtb;this.v.x*=wtf;break;
			case "yd":this.v.y=-abs(this.v.y)*wtb;this.v.x*=wtf;break;
		}
	}
	conserveMomentum(o,r,vthisx,vox,vthisy,voy,M,tob,tof){
		if(!this.isCollidingWith(o))return;
		r=o.pos.sub(this.pos).normalize();
		
		vthisx=r.scale(this.v.dot(r));
		vox=r.scale(o.v.dot(r));
		vthisy=this.v.sub(vthisx);
		voy=o.v.sub(vox);
		M=this.m+o.m;
		
		tob=this.bounciness*o.bounciness;
		tof=1-this.friction*o.friction;
		//wtf=(1-wall.friction)*(1-this.friction);
		
		this.v=vthisy.scale(tof).add(
			vthisx.scale((this.m-o.m)/M*tob),
			vox.scale(2*o.m/M*tob)
		);
		o.v=voy.scale(tof).add(
			vthisx.scale(2*this.m/M*tob),
			vox.scale((o.m-this.m)/M*tob)
		);
	}
}
class Force{
	constructor(name,f){
		this.name=name;
		this.f=f;
	}
}
function randomRange(a,b){
	return a+random()*(b-a);
}