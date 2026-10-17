import json
F = '/home/claude/fonts'
B = 0.6  # beat at 100 BPM

def sc(t0, t1, html, tr='cut', extra=''):
    return f'<div class="sc" data-t0="{t0}" data-t1="{t1}" data-tr="{tr}" {extra}>{html}</div>'

def ph(img, t0, t1, kb='1.18,1.0,0,0,0,0', style='', cls='ph beat'):
    return f'<div class="{cls}" style="background-image:url(img/{img}.jpg);{style}" data-kb="{kb}"></div>'

def g(text, top, t, cls='', size=170, extra='', anim='up', left=60):
    return f'<div class="g rgb {cls}" style="top:{top}px;left:{left}px;font-size:{size}px" data-in="{t:.2f}" data-anim="{anim}" data-dy="80" data-dur=".35" {extra}>{text}</div>'

def el(text, top, t, size=110, extra=''):
    return f'<div class="el" style="top:{top}px;font-size:{size}px" data-in="{t:.2f}" data-anim="up" data-dy="40" data-dur=".6" {extra}>{text}</div>'

def mono(text, top, t, extra='', left=64):
    st=''
    if extra.startswith('style="'): st=extra[7:-1]; extra=''
    return f'<div class="mo" style="top:{top}px;left:{left}px;{st}" data-in="{t:.2f}" data-anim="up" data-dy="20" {extra}>{text}</div>'

def stk(text, x, y, t, cls='lime', rot=-6, size=56, extra=''):
    return f'<div class="stk {cls}" style="left:{x}px;top:{y}px;font-size:{size}px" data-in="{t:.2f}" data-anim="pop" data-rot="{rot}" {extra}>{text}</div>'

SCRIM = '<div class="scrim"></div>'
DIAMOND = ('<svg class="a" width="1080" height="1920" viewBox="0 0 1080 1920" style="left:0;top:0">'
  '<g fill="none" stroke="#D4AF6A" stroke-width="3" stroke-linejoin="round">'
  '<path d="M380 700 L700 700 L820 830 L540 1130 L260 830 Z" data-draw="0.2,1.8"/>'
  '<path d="M260 830 L820 830" data-draw="0.9,2.0"/>'
  '<path d="M380 700 L460 830 L540 1130 L620 830 L700 700" data-draw="1.2,2.4"/>'
  '<path d="M460 830 L540 700 L620 830" data-draw="1.5,2.5"/></g></svg>')

def wordmark(size, top, t, extra=''):
    # dotless i with diamond dots
    dot = f'<svg class="idot" viewBox="0 0 20 18" style="width:{size*.2:.0f}px;top:{-size*.06:.0f}px"><path d="M4 1h12l4 5-10 11L0 6z" fill="#D4AF6A"/></svg>'
    i = f'<span class="ii">ı{dot}</span>'
    return f'<div class="wm" style="top:{top}px;font-size:{size}px" data-in="{t}" data-anim="zoom" data-dur=".7" {extra}>{i}nf{i}ne</div>'

LOOP = ('<svg class="a" width="1080" height="1920" viewBox="0 0 1080 1920" style="left:0;top:0">'
  '<g fill="none" stroke="#D4AF6A" stroke-width="7">'
  '<circle cx="410" cy="820" r="170" data-draw="48.2,49.6" transform="rotate(0 410 820)"/>'
  '<circle cx="670" cy="820" r="170" data-draw="48.5,49.9" transform="rotate(180 670 820)"/></g>'
  '<g data-in="49.9" data-anim="pop"><path d="M510 790h60l20 24-50 56-50-56z" fill="#0B0B0D" stroke="#D4AF6A" stroke-width="5" stroke-linejoin="round"/>'
  '<path d="M490 814h100M520 790l-10 24 30 56 30-56-10-24" fill="none" stroke="#D4AF6A" stroke-width="3"/></g></svg>')

# pixel diamond rows from the brand cover (B black, W white, P pink)
PIX = ['..BBBBBBB..', '.BWWPWPWWB.', 'BBBBBBBBBBB', '.BWWWPWWWB.', '..BWWPWWB..', '...BWPWB...', '....BWB....', '.....B.....']
def pixel(x0, y0, cell, t0, step=.04):
    out = []; k = 0
    for r, row in enumerate(PIX):
        for c, ch in enumerate(row):
            if ch == '.': continue
            col = {'B': '#111', 'W': '#fff', 'P': '#FF4FA3'}[ch]
            out.append(f'<i class="px" style="left:{x0+c*cell}px;top:{y0+r*cell}px;width:{cell+1}px;height:{cell+1}px;background:{col}" data-in="{t0+k*step:.2f}" data-anim="pop" data-dur=".2"></i>'); k += 1
    return ''.join(out)

S = []
# ---------- S1 intro 0-7.2 ----------
kin = [(5.28, 'not', '#fff', '#0B0B0D'), (5.76, 'your', '#111', '#D7FF3A'), (6.24, "mom's", '#fff', '#FF4FA3'), (6.72, 'diamonds.', '#D7FF3A', '#0B0B0D')]
k = ''.join(f'<div class="full" style="background:{bg}" data-in="{t}" data-anim="cut" data-out="{t+.48 if i<3 else 7.2}" data-od=".01"></div>'
            f'<div class="kin" style="color:{fg};font-size:{230 if i<3 else 138}px" data-in="{t}" data-anim="zoom" data-dur=".2" data-out="{t+.48 if i<3 else 7.2}" data-od=".01">{w}</div>'
            for i, (t, w, fg, bg) in enumerate(kin))
S.append(sc(0, 7.2, DIAMOND +
  '<div class="mo cen" style="top:560px;letter-spacing:.42em" data-in="0.3" data-anim="fade" data-out="4.9">DIAMONDS &amp; FINE JEWELLERY</div>' +
  el('a new era', 1210, 1.2, 120, 'data-out="4.9"') + el('<i>of diamonds.</i>', 1350, 2.4, 120, 'data-out="4.9" data-gold="1"') + k,
  tr='fade', extra='data-dust="1" data-glint="300,650,780,1150,.3"'))
# ---------- S2-S4 stack / mix / make it yours ----------
S.append(sc(7.2, 9.6, ph('wrist6', 7.2, 9.6, '1.25,1.05,0,0,40,-40') + SCRIM + g('stack it.', 1320, 7.25, 'wht', 190) +
  mono('ROUND · OVAL · EMERALD · ASSCHER', 1530, 7.7) + stk('drop 01', 700, 330, 8.4, 'lime', 8), extra='data-glint="80,300,1000,1300,.15"'))
S.append(sc(9.6, 12.0, ph('palm4', 9.6, 12, '1.1,1.28,0,-30,0,30') + SCRIM + g('mix it.', 1320, 9.65, 'pnk', 210) +
  mono('BAGUETTE · BEZEL · ROUND · PAVÉ', 1550, 10.1), extra='data-glint="120,250,1000,1300,.15"'))
S.append(sc(12.0, 14.4, ph('wrist_bw', 12, 14.4, '1.3,1.08,-40,40,0,0') + SCRIM + g('make it', 1240, 12.05, 'wht', 175) + g('yours.', 1420, 12.25, 'lim', 210) +
  mono('ICE + ONYX', 1640, 12.7), extra='data-glint="150,200,950,1200,.15"'))
# ---------- S5 shapes ----------
shapes = ['round', 'princess', 'oval', 'cushion', 'emerald', 'pear', 'marquise', 'heart']
txt = '|'.join(f'{14.7+i*.24:.2f}:{s}' for i, s in enumerate(shapes))
S.append(sc(14.4, 16.8, '<div class="card" style="left:150px;top:260px;width:780px;height:1170px" data-in="14.4" data-anim="zoom" data-dur=".5">' + ph('shapes', 0, 0, '1.0,1.08,0,0,0,0', cls='ph') + '</div>' +
  g('pick your', 1470, 14.6, 'wht', 120) + f'<div class="stk pnk" style="left:300px;top:1640px;font-size:84px" data-in="14.7" data-anim="pop" data-rot="-5" data-text="{txt}">round</div>',
  extra='data-glint="160,280,920,1420,.12"'))
# ---------- S6 arm labels ----------
S.append(sc(16.8, 19.2, ph('arm_labels', 16.8, 19.2, '1.4,1.3,-60,-60,150,-150') + stk('9 cuts.', 120, 1380, 17.0, 'lime', -6, 110) + stk('1 arm.', 520, 1560, 17.6, 'blk', 5, 110),
  extra='data-glint="300,150,1000,1700,.12"'))
# ---------- S7 after dark ----------
S.append(sc(19.2, 21.6, '<div class="card" style="left:60px;top:380px;width:960px;height:685px;background:#fff" data-in="19.2" data-anim="up" data-dy="120">' + ph('black_close', 0, 0, '1.0,1.12,0,-40,0,0', cls='ph') + '</div>' +
  g('black diamonds.', 1190, 19.5, 'wht', 92) + el('<i>after dark.</i>', 1330, 19.9, 150, 'data-gold="1"'), extra='data-glint="80,420,1000,1050,.2"'))
# ---------- S8 onyx on pearl ----------
S.append(sc(21.6, 24.0, '<div class="full" style="background:#FAF7F2"></div>' + ph('black_full', 21.6, 24, '0.9,1.0,0,0,0,0', style='mix-blend-mode:multiply;top:520px;height:820px;background-size:contain') +
  g('onyx.', 300, 21.65, 'blkt', 230) + mono('BLACK DIAMOND TENNIS BRACELET', 1420, 22.0, 'style="color:#0B0B0D"') + stk('obsessed.', 520, 1560, 22.6, 'pnk', -7, 80)))
# ---------- S9 for him ----------
S.append(sc(24.0, 26.4, ph('neck', 24, 26.4, '1.2,1.05,0,0,-60,40') + SCRIM + g('for him,', 1300, 24.05, 'wht', 175) + g('too.', 1480, 24.35, 'lim', 210),
  extra='data-glint="60,1000,1000,1500,.12"'))
# ---------- S10 main character (brand cover, date pill patched) ----------
S.append(sc(26.4, 28.8, '<div class="full" style="background:#D7FF3A"></div>' + pixel(225, 380, 57, 26.45, .02) +
  '<div class="pxt" style="top:880px" data-in="27.4" data-anim="up">MAIN</div><div class="pxt" style="top:1000px" data-in="27.55" data-anim="up">CHARACTER</div><div class="pxt" style="top:1120px" data-in="27.7" data-anim="up">ENERGY</div>' +
  '<div class="pill" style="top:1300px" data-in="27.95" data-anim="pop">drop 01 · dubai</div>'))
# ---------- S11 custom om chain ----------
S.append(sc(28.8, 31.2, ph('om_chain', 28.8, 31.2, '1.0,1.12,0,0,-160,-160', style='height:1200px;top:180px') +
  g('custom.', 1360, 29.0, 'wht', 180) + el('<i>to the millimetre.</i>', 1560, 29.5, 96, 'data-gold="1"'), extra='data-glint="160,250,920,1350,.2"'))
# ---------- S12 iced cuban count ----------
S.append(sc(31.2, 33.6, ph('iced_cuban', 31.2, 33.6, '1.05,1.2,0,0,-180,-200', style='height:1250px;top:150px') + SCRIM +
  '<div class="g lim rgb" style="top:1330px;left:60px;font-size:230px" data-in="31.3" data-anim="up" data-count="1162,31.4,32.7">0</div>' +
  mono('DIAMONDS. ONE CHAIN.', 1580, 31.6, 'style="font-size:44px;color:#fff"'), extra='data-glint="160,200,920,1300,.08"'))
# ---------- S13 rings ----------
S.append(sc(33.6, 36.0, ph('rings', 33.6, 36, '1.3,1.08,0,0,0,0') + SCRIM + g('ring', 1260, 33.65, 'wht', 200) + g('stack.', 1440, 33.85, 'pnk', 200),
  extra='data-glint="250,200,950,1300,.12"'))
# ---------- S14 tray ----------
S.append(sc(36.0, 38.4, ph('tray', 36, 38.4, '1.1,1.25,0,0,80,-60') + SCRIM + g('drops,', 1260, 36.05, 'wht', 190) + g('not collections.', 1450, 36.35, 'lim', 104),
  extra='data-glint="100,150,1000,1300,.1"'))
# ---------- S15 montage ----------
M = ['grid', 'wrist6', 'neck', 'black_close', 'palm4', 'rings', 'om_chain', 'wrist_bw', 'shapes', 'tray', 'iced_cuban', 'arm_labels', 'cover_stack', 'black_full', 'cover_pixel', 'wrist6', 'neck', 'rings', 'black_close', 'palm4']
mh = ''
for i, m in enumerate(M):
    t = 38.4 + i * .24
    patch = ''
    if m == 'cover_stack': patch = '<div style="position:absolute;left:600px;top:1450px;width:480px;height:340px;background:#121212"></div>'
    if m == 'cover_pixel': patch = '<div class="pill" style="top:1532px;background:#121212">drop 01 · dubai</div>'
    bg = '#fff' if m in ('black_close', 'black_full') else '#000'
    mh += f'<div class="full" style="background:{bg}" data-in="{t:.2f}" data-anim="cut" data-out="{t+.24:.2f}" data-od=".01">' + ph(m, 0, 0, f'{1.25 if i%2 else 1.05},{1.05 if i%2 else 1.25},0,0,0,0', style='background-size:' + ('contain' if m in ('black_close','black_full','om_chain','iced_cuban') else 'cover')) + patch + '</div>'
S.append(sc(38.4, 43.2, mh + '<div class="drop" data-in="38.5" data-anim="zoom" data-dur=".3">drop 01</div>' +
  '<div class="mo cen" style="top:1250px;font-size:40px;color:#fff;text-shadow:0 2px 12px #000" data-in="38.9" data-anim="up" data-count="20,38.4,43.15,cnt">01 / 20</div>'))
# ---------- S16 stack it native (brand cover) ----------
S.append(sc(43.2, 45.6, '<div class="full" style="background:#121212"></div>' + '<div class="mo" style="top:350px;left:64px;color:#D7FF3A;font-family:Unbounded;font-weight:700;font-size:44px" data-in="43.2" data-anim="fade">@infine</div>' +
  g('stack', 420, 43.2, 'wht', 190, anim='zoom') + g('it.', 610, 43.2, 'wht', 190, anim='zoom') + g('mix it.', 800, 43.68, 'pnk', 190, anim='zoom') +
  g('make it', 990, 44.16, 'lim', 190, anim='zoom') + g('yours.', 1180, 44.64, 'lim', 190, anim='zoom') +
  '<svg class="a" style="left:0;top:1350px" width="700" height="570" viewBox="0 0 700 570"><path id="arc" d="M110 60 Q330 -10 380 300 Q400 470 260 570" fill="none" stroke="#fff" stroke-width="7" stroke-dasharray="1 20" stroke-linecap="round" data-draw="43.3,44.4"/>'
  '<circle r="28" fill="#fff" data-dot="arc,43.4,45.4"/><circle r="20" fill="#9CD3FF" data-dot="arc,43.6,45.5"/><circle r="14" fill="#FF4FA3" data-dot="arc,43.8,45.6"/></svg>' +
  mono('drop 01<br>dubai<br><b>coming soon</b>', 1440, 44.6, 'style="left:640px;font-size:40px;line-height:1.5;color:#ccc"')))
# ---------- S17 same diamonds louder ----------
S.append(sc(45.6, 47.52, ph('grid', 45.6, 47.52, '1.0,1.15,0,0,0,0') + '<div class="full" style="background:rgba(250,247,242,.35)"></div>' +
  '<div class="band" data-in="45.65" data-anim="left"></div>' + g('same', 1180, 45.7, 'blkt', 170) + g('diamonds.', 1360, 45.85, 'blkt', 150) +
  stk('louder.', 280, 1560, 46.5, 'lime', -4, 150), extra='data-glint="80,200,1000,1100,.12"'))
# ---------- S18 brand break ----------
S.append(sc(47.52, 53.28, LOOP + '<div class="mo cen" style="top:1080px;letter-spacing:.42em;color:#D4AF6A" data-in="48.6" data-anim="fade">IN + FINE = INFINITE</div>' +
  el('Endless', 1220, 49.3, 140) + el('<i>begins here.</i>', 1370, 49.7, 140, 'data-gold="1"') +
  '<div class="ar" style="top:1560px" data-in="50.3" data-anim="up">البداية بلا نهاية</div>', tr='fade', extra='data-dust="1" data-glint="300,620,780,1020,.25"'))
# ---------- S19 end card ----------
S.append(sc(53.28, 60.01, wordmark(250, 620, 53.28) +
  '<div class="ar" style="top:920px;font-size:96px" data-in="53.78" data-anim="up">إنفاين</div>' +
  el('<i>Infinitely fine.</i>', 1080, 54.08, 80, 'data-gold="1"') +
  '<div class="pill lime" style="top:1260px" data-in="54.68" data-anim="pop">drop 01 · dubai · coming soon</div>' +
  '<div class="g lim cen" style="top:1410px;font-size:64px;left:0;right:0" data-in="55.08" data-anim="up">@infine</div>' +
  stk('fine, actually.', 70, 330, 55.48, 'pnk', -8, 54) + stk('diamond era', 520, 1610, 55.88, 'blk', 6, 54) + stk('bling', 820, 380, 56.28, 'lav', 10, 50),
  tr='fade', extra='data-dust="1" data-glint="150,550,930,950,.15"'))

CUTS = [7.2, 9.6, 12.0, 14.4, 16.8, 19.2, 21.6, 24.0, 26.4, 28.8, 31.2, 33.6, 36.0, 38.4, 43.2, 45.6, 47.52, 53.28]
CFG = {'cuts': CUTS, 'drops': [7.2, 53.28], 'bursts': [[7.2, 540, 960, 90], [26.4, 540, 600, 60], [53.28, 540, 760, 140], [38.4, 540, 960, 70]],
       'rings': [7.2, 14.4, 26.4, 38.4, 43.2, 53.28]}

css = open('/home/claude/infine/style.css').read().replace('__F__', F)
js = open('/home/claude/infine/engine.js').read().replace('__CFG__', json.dumps(CFG))
html = f'''<!doctype html><html><head><meta charset=utf8><meta name=viewport content="width=1080"><title>infine drop 01</title><style>{css}</style></head><body>
<div id="stage"><div id="bg"></div>{''.join(S)}<canvas id="fx" width="1080" height="1920"></canvas><div id="flashbg"></div>
<div id="bars"></div><div id="brand">ınfıne</div><div id="pgn">DROP 01 · DXB</div>
<div id="wipe"><b>infine</b></div><canvas id="grain" width="216" height="384"></canvas><div id="vig"></div></div>
<script>{js}</script></body></html>'''
open('/home/claude/infine/infine.html', 'w').write(html)
print('ok', len(html))
