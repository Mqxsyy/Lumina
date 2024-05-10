# Particle Plane

## Details

---

Spawns a 2D image (or in other words a plane) as a particle.

## Fields

---

### Orientation

Sets which way the particle is facing. These include:

&nbsp;&nbsp;&nbsp;&nbsp; **Facing Camera**<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Particle will face towards the camera.

&nbsp;&nbsp;&nbsp;&nbsp; **Velocity Parallel**<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Particle will be parralel to it's velocity and will also attempt to face the camera on the free axis.

&nbsp;&nbsp;&nbsp;&nbsp; **Velocity perpendicular**<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Particle will face where it's going.

### AssetId

Sets which image to display.

### DoubleSided

If the image should be displayed on both sides.

*Has an impact on performance<br/>
*Most likely not required unless particles are "VelocitPerpendicular"

### Sprite Sheet

If a spritesheet is not used then you can set rows, columns and frames to 1.

&nbsp;&nbsp;&nbsp;&nbsp; **Width**<br/>
&nbsp;&nbsp;&nbsp;&nbsp; What the width of the spritesheet should be.

&nbsp;&nbsp;&nbsp;&nbsp; **Height**<br/>
&nbsp;&nbsp;&nbsp;&nbsp; What the height of the spritesheet should be.

&nbsp;&nbsp;&nbsp;&nbsp; **Rows**<br/>
&nbsp;&nbsp;&nbsp;&nbsp; How many rows a spritesheet has.

&nbsp;&nbsp;&nbsp;&nbsp; **Columns**<br/>
&nbsp;&nbsp;&nbsp;&nbsp; How many columns a spritesheet has.

&nbsp;&nbsp;&nbsp;&nbsp; **Frames**<br/>
&nbsp;&nbsp;&nbsp;&nbsp; How many frames a spritesheet has.
