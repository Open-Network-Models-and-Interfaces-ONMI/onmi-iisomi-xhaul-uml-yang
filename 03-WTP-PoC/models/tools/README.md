# Tools
he folder contains a couple of scripts and tools, needed to generate YANG files from UML for Microwave.

The build-yang.sh takes the UML files from the ./input folder and modifies (prune and refactor) them, according to the defintions made  by xslt in pruneAndRefactor folder. The results are converted to yang modules.

The yang modules are validated using pyang.
