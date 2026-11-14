#!/usr/bin/env python3
"""Generate the fictional scanned paper records used by the Document Scanner demo.

Every record, name, number and stamp drawn here is invented for the prototype.
The script draws aged-paper images with Pillow, runs Tesseract OCR on them and
writes the images plus the OCR text and confidence values to build/sample-documents/.
Those results were then embedded as data URLs in src/assets/sample-documents.js
(DOC_ASSETS). You do not need to run this script to build or use the app.

Requirements: Python 3.9+, Pillow, the `tesseract` command, and the Liberation
and Lora fonts at the paths below (Debian/Ubuntu: fonts-liberation; Lora from Google Fonts).
"""
import random, math, json, base64, io, subprocess, os

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "build", "sample-documents")
from PIL import Image, ImageDraw, ImageFont, ImageFilter

random.seed(7)
F = "/usr/share/fonts/truetype"
MONO = f"{F}/liberation/LiberationMono-Regular.ttf"
MONOB = f"{F}/liberation/LiberationMono-Bold.ttf"
SERIFB = f"{F}/liberation/LiberationSerif-Bold.ttf"
SERIF = f"{F}/liberation/LiberationSerif-Regular.ttf"
HAND = f"{F}/google-fonts/Lora-Italic-Variable.ttf"

def font(p, s): return ImageFont.truetype(p, s)

def paper(w, h):
    img = Image.new("RGB", (w, h), (246, 242, 230))
    px = img.load()
    for _ in range(int(w*h*0.02)):
        x, y = random.randrange(w), random.randrange(h)
        v = random.randint(-14, 6)
        r, g, b = px[x, y]
        px[x, y] = (max(0,min(255,r+v)), max(0,min(255,g+v)), max(0,min(255,b+v)))
    d = ImageDraw.Draw(img)
    # soft fold line and edge shading
    d.line([(0, h*0.48), (w, h*0.49)], fill=(232, 226, 210), width=3)
    return img

def doc(lines, w=1000, h=1300, scale=1.0, angle=0.6, hand=None, stamp=None, path="x.jpg"):
    img = paper(w, h)
    d = ImageDraw.Draw(img)
    y = int(60*scale)
    for kind, text in lines:
        if kind == "h1":
            f = font(SERIFB, int(30*scale)); tw = d.textlength(text, font=f)
            d.text(((w-tw)/2, y), text, font=f, fill=(25, 25, 30)); y += int(44*scale)
        elif kind == "h2":
            f = font(SERIF, int(21*scale)); tw = d.textlength(text, font=f)
            d.text(((w-tw)/2, y), text, font=f, fill=(40, 40, 45)); y += int(34*scale)
        elif kind == "rule":
            d.line([(int(60*scale), y+6), (w-int(60*scale), y+6)], fill=(60,60,60), width=2); y += int(26*scale)
        elif kind == "title":
            f = font(MONOB, int(24*scale)); d.text((int(70*scale), y), text, font=f, fill=(20,20,25)); y += int(40*scale)
        elif kind == "gap":
            y += int(16*scale)
        else:
            f = font(MONO, int(21*scale))
            jitter = random.uniform(-0.6, 0.6)
            d.text((int(70*scale)+jitter, y), text, font=f, fill=(28, 28, 34)); y += int(33*scale)
    if hand:
        for (hx, hy, text, size) in hand:
            f = font(HAND, int(size*scale))
            layer = Image.new("RGBA", (w, int(80*scale)), (0,0,0,0))
            ld = ImageDraw.Draw(layer)
            ld.text((0, 0), text, font=f, fill=(30, 45, 140, 235))
            layer = layer.rotate(random.uniform(-3, 3), resample=Image.BICUBIC, expand=False)
            img.paste(layer, (int(hx*scale), int(hy*scale)), layer)
    if stamp:
        sx, sy, txt = stamp
        layer = Image.new("RGBA", (int(300*scale), int(110*scale)), (0,0,0,0))
        ld = ImageDraw.Draw(layer)
        ld.rounded_rectangle([4,4,int(296*scale),int(106*scale)], radius=12, outline=(150,40,60,170), width=4)
        f = font(SERIFB, int(22*scale))
        for i, t in enumerate(txt.split("\n")):
            tw = ld.textlength(t, font=f)
            ld.text(((int(300*scale)-tw)/2, int(18*scale)+i*int(34*scale)), t, font=f, fill=(150,40,60,170))
        layer = layer.rotate(-8, resample=Image.BICUBIC, expand=True)
        img.paste(layer, (int(sx*scale), int(sy*scale)), layer)
    # watermark
    wm = Image.new("RGBA", (w, h), (0,0,0,0))
    wd = ImageDraw.Draw(wm)
    f = font(SERIFB, int(64*scale))
    wd.text((w*0.12, h*0.62), "FICTIONAL SAMPLE", font=f, fill=(120,120,120,38))
    wm = wm.rotate(28, resample=Image.BICUBIC)
    img.paste(wm, (0,0), wm)
    img = img.rotate(angle, resample=Image.BICUBIC, expand=False, fillcolor=(210, 206, 196))
    img = img.filter(ImageFilter.GaussianBlur(0.45))
    img.save(path, "JPEG", quality=62, optimize=True, progressive=True)
    return path

HEAD = [("h1", "DEMO POLICE STATION, KALABURAGI"), ("h2", "(Fictional record for prototype use only)"), ("rule", "")]

samples = {
 "DEMO-309": dict(lines=HEAD + [
    ("title", "INCIDENT REPORT                Ref: DEMO-309"), ("gap",""),
    ("t", "Date: 18/10/2026            Time: 07:40 hrs"),
    ("t", "Place: Near Aland Road check post, Kalaburagi"),
    ("t", "Reported by: Mahesh Kulkarni (Informant)"),
    ("t", "Informant contact: +91 00000 62840"), ("gap",""),
    ("t", "Details:"),
    ("t", "A two-wheeler was found parked unattended near"),
    ("t", "the check post since the previous night. The"),
    ("t", "registration plate reads KA 00 DM 4471."),
    ("t", "Vehicle moved to station premises for safe"),
    ("t", "keeping. Side mirror broken, no other damage."), ("gap",""),
    ("t", "Action: Entry made in general diary."),
    ("t", "Owner of the vehicle to be traced."), ("gap",""),
    ("t", "Recorded by: HC 214 (Demo)"),
 ], hand=[(560, 1060, "Seen. Check theft reports - SI", 30)], stamp=(620, 860, "RECEIVED\n18 OCT 2026")),
 "DEMO-312": dict(lines=HEAD + [
    ("title", "LOST PROPERTY REPORT           Ref: DEMO-312"), ("gap",""),
    ("t", "Date: 21/10/2026            Time: 18:15 hrs"),
    ("t", "Place: Central Bus Stand, Kalaburagi"),
    ("t", "Complainant: Farhana Begum"),
    ("t", "Contact: +91 00000 31416"), ("gap",""),
    ("t", "Details:"),
    ("t", "Complainant states a black handbag was left on"),
    ("t", "a bench near platform 4. The bag held a mobile"),
    ("t", "phone, IMEI 350000009876543, and a purse with"),
    ("t", "about Rs 1,200 cash. No theft is alleged at"),
    ("t", "this time. Complainant requests a lost property"),
    ("t", "acknowledgement for her records."), ("gap",""),
    ("t", "Action: Acknowledgement issued. Bus stand staff"),
    ("t", "informed to report if the bag is found."), ("gap",""),
    ("t", "Recorded by: PC 377 (Demo)"),
 ], hand=[(600, 1080, "F. Begum", 34)], stamp=None),
 "DEMO-318": dict(lines=HEAD + [
    ("title", "GENERAL DIARY EXTRACT          Ref: DEMO-318"), ("gap",""),
    ("t", "Date:                       Time: 11:05 hrs"),
    ("t", "Place: Khuba Plot, Kalaburagi"),
    ("t", "Petitioner: Raghavendra Joshi"),
    ("t", "Contact: +91 00000 70215"), ("gap",""),
    ("t", "Subject: Repeated calls asking for OTP"), ("gap",""),
    ("t", "Petitioner states he received three calls from"),
    ("t", "+91 00000 55821. The caller claimed to be from"),
    ("t", "a bank and asked for an OTP. Petitioner did not"),
    ("t", "share any OTP and lost no money. He requests"),
    ("t", "that the number be noted for awareness."), ("gap",""),
    ("t", "Action: Petition received. Awareness advice"),
    ("t", "given to petitioner."), ("gap",""),
    ("t", "Recorded by: HC 214 (Demo)"),
 ], hand=[(150, 166+0, "", 1), (175, 218, "24/10/2026", 30), (560, 1070, "R. Joshi", 34)], stamp=None),
}
# fix: handwritten date sits on the Date line
samples["DEMO-318"]["hand"] = [(150, 190, "24/10/2026", 28), (600, 1070, "R. Joshi", 34)]

sources205 = {
 "SRC-205-A": ("Complaint copy", HEAD + [
    ("title", "COMPLAINT                Ref: DEMO-205"), ("gap",""),
    ("t", "Date: 02/10/2026        Time: 22:10 hrs"),
    ("t", "Place: Jewargi Road, near bus shelter"),
    ("t", "Complainant: Anil Deshmukh"),
    ("t", "Contact: +91 00000 48120"), ("gap",""),
    ("t", "Complainant parked his motorcycle"),
    ("t", "KA 00 DM 4471 at 19:30 hrs and found"),
    ("t", "it missing at 21:45 hrs."),
 ]),
 "SRC-205-B": ("Vehicle details sheet", HEAD + [
    ("title", "VEHICLE DETAILS (SPECIMEN)  DEMO-205"), ("gap",""),
    ("t", "Registration: KA 00 DM 4471"),
    ("t", "Type: Motorcycle, 125 cc, black"),
    ("t", "Owner: Anil Deshmukh"),
    ("t", "Chassis ref: DEMO-CH-55120"),
 ]),
 "SRC-205-C": ("Officer site note", HEAD + [
    ("title", "SITE NOTE                 DEMO-205"), ("gap",""),
    ("t", "Visited Jewargi Road bus shelter on"),
    ("t", "03/10/2026 at 09:00 hrs. No CCTV at"),
    ("t", "the shelter. Shop owner nearby to be"),
    ("t", "asked about private camera footage."),
    ("t", "Noted by: SI (Demo)"),
 ]),
}

out = {"samples": {}, "sources": {}}
os.makedirs(os.path.join(OUT, "img"), exist_ok=True)
for ref, s in samples.items():
    p = doc(s["lines"], hand=s["hand"], stamp=s["stamp"], path=os.path.join(OUT, "img", f"{ref}.jpg"), angle=random.uniform(-0.9, 0.9))
    # tesseract OCR with tsv for confidences
    txt = subprocess.run(["tesseract", p, "-", "--psm", "6"], capture_output=True, text=True).stdout
    tsv = subprocess.run(["tesseract", p, "-", "--psm", "6", "tsv"], capture_output=True, text=True).stdout
    confs = [float(r.split("\t")[10]) for r in tsv.splitlines()[1:] if len(r.split("\t"))>11 and r.split("\t")[11].strip() and float(r.split("\t")[10])>=0]
    out["samples"][ref] = {"img": p, "ocr": txt, "meanConf": round(sum(confs)/len(confs),1) if confs else None}
    print("=====", ref, out["samples"][ref]["meanConf"]); print(txt)
for ref, (title, lines) in sources205.items():
    p = doc(lines, w=760, h=640, scale=0.95, angle=random.uniform(-0.8,0.8), path=os.path.join(OUT, "img", f"{ref}.jpg"))
    txt = subprocess.run(["tesseract", p, "-", "--psm", "6"], capture_output=True, text=True).stdout
    out["sources"][ref] = {"img": p, "ocr": txt, "title": title}
json.dump(out, open(os.path.join(OUT, "docs_meta.json"), "w"), indent=1)
print("Wrote", os.path.normpath(OUT))
