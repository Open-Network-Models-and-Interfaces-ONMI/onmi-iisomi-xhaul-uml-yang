# Spectrum

The devices gets connected (ODL connection status changed to “connected”). 
The application should check the current configured frequencies/polarization. 
With the information of the device name and the AirInterface.radioSignalIds it ask a SpectrumProviderService (maybe a simple file or database via a WebService) about the expected or planned frequencies. 
Later it can be a service returning the frequency on the fly by some calculations, maybe such service can be later also provided by a regulation agency (via a WebService). 
Then the app compares the configured frequencies with the returned Frequencies – in case of a mismatch the app configures the frequencies in the device. 
By writing it, I think also the polarization should be returned by the SpectrumProviderService. 
The Decision and the Configuration should be logged in a persistent database. 

