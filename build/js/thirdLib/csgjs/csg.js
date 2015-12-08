// Constructive Solid Geometry (CSG) is a modeling technique that uses Boolean
// operations like union and intersection to combine 3D solids. This library
// implements CSG operations on meshes elegantly and concisely using BSP trees,
// and is meant to serve as an easily understandable implementation of the
// algorithm. All edge cases involving overlapping coplanar polygons in both
// solids are correctly handled.
// 
// Example usage:
// 
//     var cube = CSG.cube();
//     var sphere = CSG.sphere({ radius: 1.3 });
//     var polygons = cube.subtract(sphere).toPolygons();
// 
// ## Implementation Details
// 
// All CSG operations are implemented in terms of two functions, `clipTo()` and
// `invert()`, which remove parts of a BSP tree inside another BSP tree and swap
// solid and empty space, respectively. To find the union of `a` and `b`, we
// want to remove everything in `a` inside `b` and everything in `b` inside `a`,
// then combine polygons from `a` and `b` into one solid:
// 
//     a.clipTo(b);
//     b.clipTo(a);
//     a.build(b.allPolygons());
// 
// The only tricky part is handling overlapping coplanar polygons in both trees.
// The code above keeps both copies, but we need to keep them in one tree and
// remove them in the other tree. To remove them from `b` we can clip the
// inverse of `b` against `a`. The code for union now looks like this:
// 
//     a.clipTo(b);
//     b.clipTo(a);
//     b.invert();
//     b.clipTo(a);
//     b.invert();
//     a.build(b.allPolygons());
// 
// Subtraction and intersection naturally follow from set operations. If
// union is `A | B`, subtraction is `A - B = ~(~A | B)` and intersection is
// `A & B = ~(~A | ~B)` where `~` is the complement operator.
// 
// ## License
// 
// Copyright (c) 2011 Evan Wallace (http://madebyevan.com/), under the MIT license.

define(["require"],function(e){var t=function(){this.polygons=[]};return t.fromPolygons=function(e){var n=new t;return n.polygons=e,n},t.prototype={clone:function(){var e=new t;return e.polygons=this.polygons.map(function(e){return e.clone()}),e},toPolygons:function(){return this.polygons},union:function(e){var n=new t.Node(this.clone().polygons),r=new t.Node(e.clone().polygons);return n.clipTo(r),r.clipTo(n),r.invert(),r.clipTo(n),r.invert(),n.build(r.allPolygons()),t.fromPolygons(n.allPolygons())},subtract:function(e){var n=new t.Node(this.clone().polygons),r=new t.Node(e.clone().polygons);return n.invert(),n.clipTo(r),r.clipTo(n),r.invert(),r.clipTo(n),r.invert(),n.build(r.allPolygons()),n.invert(),t.fromPolygons(n.allPolygons())},intersect:function(e){var n=new t.Node(this.clone().polygons),r=new t.Node(e.clone().polygons);return n.invert(),r.clipTo(n),r.invert(),n.clipTo(r),r.clipTo(n),n.build(r.allPolygons()),n.invert(),t.fromPolygons(n.allPolygons())},inverse:function(){var e=this.clone();return e.polygons.map(function(e){e.flip()}),e}},t.cube=function(e){e=e||{};var n=new t.Vector(e.center||[0,0,0]),r=e.radius?e.radius.length?e.radius:[e.radius,e.radius,e.radius]:[1,1,1];return t.fromPolygons([[[0,4,6,2],[-1,0,0]],[[1,3,7,5],[1,0,0]],[[0,1,5,4],[0,-1,0]],[[2,6,7,3],[0,1,0]],[[0,2,3,1],[0,0,-1]],[[4,5,7,6],[0,0,1]]].map(function(e){return new t.Polygon(e[0].map(function(i){var s=new t.Vector(n.x+r[0]*(2*!!(i&1)-1),n.y+r[1]*(2*!!(i&2)-1),n.z+r[2]*(2*!!(i&4)-1));return new t.Vertex(s,new t.Vector(e[1]))}))}))},t.sphere=function(e){function a(e,i){e*=Math.PI*2,i*=Math.PI;var s=new t.Vector(Math.cos(e)*Math.sin(i),Math.cos(i),Math.sin(e)*Math.sin(i));u.push(new t.Vertex(n.plus(s.times(r)),s))}e=e||{};var n=new t.Vector(e.center||[0,0,0]),r=e.radius||1,i=e.slices||16,s=e.stacks||8,o=[],u;for(var f=0;f<i;f++)for(var l=0;l<s;l++)u=[],a(f/i,l/s),l>0&&a((f+1)/i,l/s),l<s-1&&a((f+1)/i,(l+1)/s),a(f/i,(l+1)/s),o.push(new t.Polygon(u));return t.fromPolygons(o)},t.cylinder=function(e){function d(e,r,o){var a=r*Math.PI*2,c=f.times(Math.cos(a)).plus(l.times(Math.sin(a))),h=n.plus(i.times(e)).plus(c.times(s)),p=c.times(1-Math.abs(o)).plus(u.times(o));return new t.Vertex(h,p)}e=e||{};var n=new t.Vector(e.start||[0,-1,0]),r=new t.Vector(e.end||[0,1,0]),i=r.minus(n),s=e.radius||1,o=e.slices||16,u=i.unit(),a=Math.abs(u.y)>.5,f=(new t.Vector(a,!a,0)).cross(u).unit(),l=f.cross(u).unit(),c=new t.Vertex(n,u.negated()),h=new t.Vertex(r,u.unit()),p=[];for(var v=0;v<o;v++){var m=v/o,g=(v+1)/o;p.push(new t.Polygon([c,d(0,m,-1),d(0,g,-1)])),p.push(new t.Polygon([d(0,g,0),d(0,m,0),d(1,m,0),d(1,g,0)])),p.push(new t.Polygon([h,d(1,g,1),d(1,m,1)]))}return t.fromPolygons(p)},t.Vector=function(e,t,n){arguments.length==3?(this.x=e,this.y=t,this.z=n):"x"in e?(this.x=e.x,this.y=e.y,this.z=e.z):(this.x=e[0],this.y=e[1],this.z=e[2])},t.Vector.prototype={clone:function(){return new t.Vector(this.x,this.y,this.z)},negated:function(){return new t.Vector(-this.x,-this.y,-this.z)},plus:function(e){return new t.Vector(this.x+e.x,this.y+e.y,this.z+e.z)},minus:function(e){return new t.Vector(this.x-e.x,this.y-e.y,this.z-e.z)},times:function(e){return new t.Vector(this.x*e,this.y*e,this.z*e)},dividedBy:function(e){return new t.Vector(this.x/e,this.y/e,this.z/e)},dot:function(e){return this.x*e.x+this.y*e.y+this.z*e.z},lerp:function(e,t){return this.plus(e.minus(this).times(t))},length:function(){return Math.sqrt(this.dot(this))},unit:function(){return this.dividedBy(this.length())},cross:function(e){return new t.Vector(this.y*e.z-this.z*e.y,this.z*e.x-this.x*e.z,this.x*e.y-this.y*e.x)}},t.Vertex=function(e,n){this.pos=new t.Vector(e),this.normal=new t.Vector(n)},t.Vertex.prototype={clone:function(){return new t.Vertex(this.pos.clone(),this.normal.clone())},flip:function(){this.normal=this.normal.negated()},interpolate:function(e,n){return new t.Vertex(this.pos.lerp(e.pos,n),this.normal.lerp(e.normal,n))}},t.Plane=function(e,t){this.normal=e,this.w=t},t.Plane.EPSILON=1e-5,t.Plane.fromPoints=function(e,n,r){var i=n.minus(e).cross(r.minus(e)).unit();return new t.Plane(i,i.dot(e))},t.Plane.prototype={clone:function(){return new t.Plane(this.normal.clone(),this.w)},flip:function(){this.normal=this.normal.negated(),this.w=-this.w},splitPolygon:function(e,n,r,i,s){var o=0,u=1,a=2,f=3,l=0,c=[];for(var h=0;h<e.vertices.length;h++){var p=this.normal.dot(e.vertices[h].pos)-this.w,d=p<-t.Plane.EPSILON?a:p>t.Plane.EPSILON?u:o;l|=d,c.push(d)}switch(l){case o:(this.normal.dot(e.plane.normal)>0?n:r).push(e);break;case u:i.push(e);break;case a:s.push(e);break;case f:var v=[],m=[];for(var h=0;h<e.vertices.length;h++){var g=(h+1)%e.vertices.length,y=c[h],b=c[g],w=e.vertices[h],E=e.vertices[g];y!=a&&v.push(w),y!=u&&m.push(y!=a?w.clone():w);if((y|b)==f){var p=(this.w-this.normal.dot(w.pos))/this.normal.dot(E.pos.minus(w.pos)),S=w.interpolate(E,p);v.push(S),m.push(S.clone())}}v.length>=3&&i.push(new t.Polygon(v,e.shared)),m.length>=3&&s.push(new t.Polygon(m,e.shared))}}},t.Polygon=function(e,n){this.vertices=e,this.shared=n,this.plane=t.Plane.fromPoints(e[0].pos,e[1].pos,e[2].pos)},t.Polygon.prototype={clone:function(){var e=this.vertices.map(function(e){return e.clone()});return new t.Polygon(e,this.shared)},flip:function(){this.vertices.reverse().map(function(e){e.flip()}),this.plane.flip()}},t.Node=function(e){this.plane=null,this.front=null,this.back=null,this.polygons=[],e&&this.build(e)},t.Node.prototype={clone:function(){var e=new t.Node;return e.plane=this.plane&&this.plane.clone(),e.front=this.front&&this.front.clone(),e.back=this.back&&this.back.clone(),e.polygons=this.polygons.map(function(e){return e.clone()}),e},invert:function(){for(var e=0;e<this.polygons.length;e++)this.polygons[e].flip();this.plane.flip(),this.front&&this.front.invert(),this.back&&this.back.invert();var t=this.front;this.front=this.back,this.back=t},clipPolygons:function(e){if(!this.plane)return e.slice();var t=[],n=[];for(var r=0;r<e.length;r++)this.plane.splitPolygon(e[r],t,n,t,n);return this.front&&(t=this.front.clipPolygons(t)),this.back?n=this.back.clipPolygons(n):n=[],t.concat(n)},clipTo:function(e){this.polygons=e.clipPolygons(this.polygons),this.front&&this.front.clipTo(e),this.back&&this.back.clipTo(e)},allPolygons:function(){var e=this.polygons.slice();return this.front&&(e=e.concat(this.front.allPolygons())),this.back&&(e=e.concat(this.back.allPolygons())),e},build:function(e){if(!e.length)return;this.plane||(this.plane=e[0].plane.clone());var n=[],r=[];for(var i=0;i<e.length;i++)this.plane.splitPolygon(e[i],this.polygons,this.polygons,n,r);n.length&&(this.front||(this.front=new t.Node),this.front.build(n)),r.length&&(this.back||(this.back=new t.Node),this.back.build(r))}},t});