from PIL import Image, ImageFilter, ImageDraw
U='/root/.claude/uploads/6e4f258b-2139-544d-a383-4380a0205a26/'
J=[('wrist_bw','3e4a45d7-PHOTO-2026-10-08-21-30-22.jpg',(0,0,1063,1160),[]),
 ('neck','6a902bee-PHOTO-2026-10-07-10-20-06.jpg',(0,150,590,1095),[]),
 ('black_full','8dedb949-PHOTO-2026-10-08-21-29-29.jpg',(0,330,589,780),[]),
 ('black_close','369880d6-PHOTO-2026-10-08-21-29-11.jpg',(0,430,589,850),[]),
 ('om_chain','a9d3fb14-PHOTO-2026-10-08-18-42-52.jpg',(340,0,1230,960),[(0,855,70,960)]),
 ('iced_cuban','bdd185c6-PHOTO-2026-10-08-18-42-49.jpg',(280,0,1020,848),[(0,665,40,848),(690,665,740,848)]),
 ('cover_pixel','7494ea5c-PHOTO-2026-10-16-22-39-36.jpg',None,[]),
 ('cover_stack','894be85d-PHOTO-2026-10-16-22-39-36.jpg',None,[]),
 ('palm4','749e701b-5d0f9f02-0fd2-4938-9624-f0436eeda48d.jpeg',None,[]),
 ('wrist6','61632f34-cdd70852-bc93-4bc4-b86b-d657a1ae912d.jpeg',None,[]),
 ('arm_labels','f81d2725-e59e520f-24c8-4aa4-9023-6fb6f7af665d.jpeg',(105,0,836,800),[]),
 ('shapes','8c8cd471-35ff02f0-0132-4d0d-aff6-dd27a588f967.jpeg',None,[]),
 ('grid','6205a778-04da7dc7-cbb6-4a13-b35a-fd649602ec20.jpeg',(0,0,900,927),[(20,50,85,125,'s'),(815,825,895,905,'s')]),
 ('tray','c3a0b22b-34f38800-48f5-4b48-bab3-74f2ed77e248.jpeg',(95,0,725,789),[]),
 ('rings','db166a57-2867b85b-c3e1-4de9-99ba-9b52b0f6c158.jpeg',(0,0,878,931),[]),]
for name,f,crop,fills in J:
  im=Image.open(U+f).convert('RGB')
  if crop: im=im.crop(crop)
  d=ImageDraw.Draw(im)
  for r in fills:
    if len(r)==5:  # sample neighbour colour above-left
      x0,y0,x1,y1,_=r; c=im.getpixel((max(0,x0-6),max(0,y0-6)))
      d.rounded_rectangle((x0,y0,x1,y1),12,fill=c)
    else: d.rectangle(r,fill=(0,0,0))
  s=1600/max(im.size)
  if s>1: im=im.resize((round(im.width*s),round(im.height*s)),Image.LANCZOS).filter(ImageFilter.UnsharpMask(2,60,2))
  im.save(f'img/{name}.jpg',quality=92); print(name,im.size)
