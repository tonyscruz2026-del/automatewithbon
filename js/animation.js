spheres.forEach((sphere,index)=>{

sphere.position.y=

sphere.userData.baseY+

Math.sin(

t*1.6+

index

)*0.15;

sphere.rotation.y+=0.003;

sphere.rotation.x+=0.0015;

if(index===0){

const pulse=

1+

Math.sin(

t*3

)*0.05;

sphere.scale.setScalar(

1.7*pulse

);

}

});
