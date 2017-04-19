"""
Process .mp4 files into frames using ffmpeg.
"""

import sys
import os
import subprocess
import shutil

devnull = open(os.devnull, "w")

def usage():
    print >>sys.stderr, "Usage: process.py <file-or-directory...>"
    sys.exit(1)

if len(sys.argv) < 2:
    usage()

def process_file(path):
    assert path.endswith(".mp4")

    root, leaf = os.path.split(path)
    frames_directory = os.path.join(root, leaf + ".frames")
    if os.path.exists(frames_directory):
        return
    print "Processing {} into {}".format(path, frames_directory)
    os.mkdir(frames_directory)
    try:
        frame_pattern = os.path.join(frames_directory, "frame%d.jpg")
        subprocess.check_call(["ffmpeg.exe", "-i", path, frame_pattern], stdout=devnull, stderr=devnull)
    except:
        shutil.rmtree(frames_directory)
        raise

def process_dir(path):
    for leaf in os.listdir(path):
        if leaf.endswith(".mp4"):
            process_file(os.path.join(path, leaf))

for path in sys.argv[1:]:
    if path.startswith("-"):
        usage()
    if os.path.isdir(path):
        process_dir(path)
    elif path.endswith(".mp4"):
        process_file(path)
    else:
        usage()


