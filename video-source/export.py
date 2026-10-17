import asyncio,sys,base64,subprocess
from playwright.async_api import async_playwright
R='/home/claude/infine'
mode=sys.argv[1]
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(args=['--allow-file-access-from-files'])
    pg=await b.new_page(viewport={'width':1080,'height':1920})
    errs=[];pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:m.type=='error' and errs.append(m.text))
    await pg.goto(f'file://{R}/infine.html');await pg.wait_for_timeout(1200);await pg.evaluate('document.fonts.ready')
    if mode=='sheet':
      for t in [float(x) for x in sys.argv[2].split(',')]:
        await pg.evaluate(f'window.__reel.seek({t})');await pg.screenshot(path=f'{R}/out/f_{t:05.2f}.png')
    elif mode=='audio':
      s=await pg.evaluate('window.__reel.audio()');open(f'{R}/out/audio.wav','wb').write(base64.b64decode(s))
    elif mode=='video':
      fps=30
      ff=subprocess.Popen(['ffmpeg','-y','-loglevel','error','-f','image2pipe','-framerate',str(fps),'-c:v','mjpeg','-i','-','-i',f'{R}/out/audio.wav',
        '-map','0:v','-map','1:a','-c:v','libx264','-preset','slow','-profile:v','high','-pix_fmt','yuv420p','-crf','22','-maxrate','1.85M','-bufsize','3.7M',
        '-af','loudnorm=I=-14:TP=-1.5:LRA=11','-ar','44100','-c:a','aac','-b:a','160k','-t','60','-movflags','+faststart',sys.argv[2]],stdin=subprocess.PIPE)
      for i in range(60*fps):
        await pg.evaluate(f'window.__reel.seek({i/fps})');ff.stdin.write(await pg.screenshot(type='jpeg',quality=92))
        if i%300==0: print('frame',i,flush=True)
      ff.stdin.close();ff.wait()
    print(mode,'errors:',errs[:5])
    await b.close()
asyncio.run(main())
