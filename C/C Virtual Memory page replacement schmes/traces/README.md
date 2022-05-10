#
# Some information on the files here.

These are memory traces generated by using `pin` from Intel. They have
been kept in a straight-forward, uncompressed text format in order to
ease programming.

If we wanted to make serious use of such traces, however, we would
most likely store them in a more compact format that would also be
easier to input to a program. For now, however, we'll stick with text.

* `hello_out.txt`: Generated by a plain-old "hello, world"
  program.

* `ls_out.txt`: Generated from a run of the Unix `ls` command for some
  directory (the pathname and contents of which I forget).

* `matrixmult_out.txt`: Generated from an unoptimized
  matrix-multiplication routine work with very small square matrices
  (3x3 in size).