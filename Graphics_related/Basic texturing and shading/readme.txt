Note: Need to go to setting in browser to allow external images to be loaded for textures

csc305 A2 by Aaron Mok

Tasks:
1)Yes, a cactus with two arms, rotating at two points and a white round creature.
2)Yes, everything except the spheres on the ground are textured.
3)No, Current build does not have a modified shader. Some attempt was made
4)Yes, after a short while when camera position stops at the cactus, the camera will spin around. (although not a full 360, I stopped it
at a specific time to angle a shot. To get the full 360, the value at line 811 just needs to be a larger value.
5)Yes, most animations are done with TIME.
6)Yes, frame rate is displayed.
7)Although simple rotations, I tried to make it look nice at least.
8)I spent a pretty long time making the Poyoyo. Hope you like it haha :D
9)I'm not the most artistic person out there, please be gentle on me.
10)Split drawings, camera motions and other stuff into smaller functions.
11)Music played in the background is from music I bought. More details below
12)Yes, unless this readme goes poof :thinking:

Additional details:
Copyright disclaimer:
Music
"Fragrent Motivational Switch" by Foxtail-Grass Studio (first part)
"DuckTales Music - The Moon Theme" composed by Yoshihiro Sakagushi and owned by Capcom, Disney, Wayforward (latter part)
Images
Found under the 'free assets' section of itch.io and Unity store.

Animation details:
Story:A stroll down a path on a blue day, nothing much to look at... or is there?
The cactus will go into infinity if animation is not stopped
I used toggle texture on the rocks, so when toggle texture is pressed, rock will be textured and everything else will revert
Camera will clip into the mountains during 360 rotation
When using the scrollers, the fps will shoot high, at that point please just click 'toggle animation' and it should reset back to 60.
Animation is done assuming 60fps. If any latency occurs, the timing of the animations will be off.
Last note:A timer will start when 'toggle animation' is pressed. Stopping at any point might mess up the sync.

Code details:
Shader:
I'm modifying the shader provided to us, trying to imitate a wave like effect.
All the smaller details are within the code.
