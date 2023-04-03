from voiceAI.header import *
from voiceAI.shutil_which import *

def get_flac_converter():
    flac_converter = shutil_which("flac")  # check for installed version first
    if flac_converter is None:  # flac utility is not installed
        base_path = os.path.dirname(os.path.abspath(__file__))  # directory of the current module file, where all the FLAC bundled binaries are stored
        system, machine = platform.system(), platform.machine()
        if system == "Windows" and machine in {"i686", "i786", "x86", "x86_64", "AMD64"}:
            flac_converter = os.path.join(base_path, "flac-win32.exe")
        elif system == "Darwin" and machine in {"i686", "i786", "x86", "x86_64", "AMD64"}:
            flac_converter = os.path.join(base_path, "flac-mac")
        elif system == "Linux" and machine in {"i686", "i786", "x86"}:
            flac_converter = os.path.join(base_path, "flac-linux-x86")
        elif system == "Linux" and machine in {"x86_64", "AMD64"}:
            flac_converter = os.path.join(base_path, "flac-linux-x86_64")
        else:  # no FLAC converter available
            raise OSError("FLAC conversion utility not available - consider installing the FLAC command line application by running `apt-get install flac` or your operating system's equivalent")

    # mark FLAC converter as executable if possible
    try:
        stat_info = os.stat(flac_converter)
        os.chmod(flac_converter, stat_info.st_mode | stat.S_IEXEC)
    except OSError: pass

    return flac_converter
