# music.suningyao.com

## intro

some selected original music from [Suning Yao](https://suningyao.com/)

visualized by a ThreeJS project by [Suning Yao](https://suningyao.com/)

read project details in this blog post by [Suning Yao](https://suningyao.com/)

## make your own player

1. put audio file into `src/audio`

2. import `src/audio/music.mp3` into `src/main.ts`

```js
import musicA from './audio/musicA.mp3';
import musicB from './audio/musicB.mp3';
```

3. add the file at the end of `audioSrc` array in `model` of `main.ts`

```js
let model = {
  activeView: 1,
  pointerPosition: new THREE.Vector2(0, 0),
  audioSrc: [musicA, musicB],
};
```

[example](https://github.com/fewwwww/playlist)
