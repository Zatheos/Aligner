# Aligner

A simple tool which uses the hunt-mcilroy algorithm to find the word-level difference between two strings, and then aligns them as well as possible in order to allow a researcher to quickly make changes with simple operations like inserting blank cells into the table or pushing cell contents up and down.

The tool accepts a csv uploaded with headers "ResponseId" and then numbers (1-initial) for the sentences. There must be one ResponseId of "truth" containing the correct transcription for each sentence, and one ResponseId of "meta" containing [speaker]-[sentence]-[speech noise ratio], eg "adam-s3-3"

Columns with any other headers (other than ResponseId or digits) will be ignored. Missing digits will cause those after the omission to be ignored - eg column headers of 1, 2, 3, 5, 6, 7 will allow the tool process sentences 1, 2, 3 and then stop.

Cells containing commas or newlines (eg \r\n) will cause the tool to break as the csv reader is very basic.

Priority was given to ensuring that words can never be deleted or reordered - only realigned (spaces inserted) within the given order. 

Emphasis was given to writing code quickly rather than following strict best practice as this is sufficiently bespoke that it's unlikely to be used more than once or twice. 

Moving forward I'd like to see the flagging methods generalised to allow the user to configure as many flags as they'd like, using a key of their choice, with a header of their choice. 