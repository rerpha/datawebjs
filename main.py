import zlib
import binascii
import sys 

def dehex_and_decompress(value):
    """Decompresses the inputted string, assuming it is in hex encoding.

    Args:
        value (bytes): The string to be decompressed, encoded in hex

    Returns:
        bytes : A decompressed version of the inputted string
    """
    return zlib.decompress(binascii.unhexlify(value)).decode("utf-8") 


if __name__ == '__main__':
  print(dehex_and_decompress(sys.argv[1]))
