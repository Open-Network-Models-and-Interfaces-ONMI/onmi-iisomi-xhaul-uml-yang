package org.opendaylight.mwtn.base.internalTypes;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map.Entry;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class IniConfigurationFile {

	private static final Logger LOG = LoggerFactory.getLogger(IniConfigurationFile.class);

	public static class ConfigurationException extends Exception {
		/**
		 *
		 */
		private static final long serialVersionUID = 733061908616404383L;

		public ConfigurationException(String m) {
			super(m);
		}
	}

	public static class ConversionException extends Exception {
		/**
		 *
		 */
		private static final long serialVersionUID = 5179891576029923079L;

		public ConversionException(String m) {
			super(m);
		}
	}

	public static final String SECTIONNAME_ROOT = "";
	public static final String DELIMITER = "=";

	private static class SectionValue {
		public String Value;
		public final List<String> Comments;
		public boolean IsUncommented;

		public SectionValue(String value) {
			this(value, new ArrayList<String>(), false);
		}

		public SectionValue(String value, List<String> commentsForValue, boolean isuncommented) {
			this.Comments = commentsForValue;
			this.Value = value;
			this.IsUncommented = isuncommented;
		}
	}

	public static class Section {
		public final String Name;
		public final List<String> rawLines;
		public final LinkedHashMap<String, SectionValue> values;

		public Section(String name) {
			LOG.debug("new section created:" + name);
			this.Name = name;
			this.rawLines = new ArrayList<String>();
			this.values = new LinkedHashMap<String, SectionValue>();
		}

		public void addLine(String line) {
			LOG.trace("adding raw line:" + line);
			this.rawLines.add(line);
		}

		public String getProperty(String key) {
			return this.getProperty(key, null);
		}

		public String getProperty(String key, String defValue) {
			if (values.containsKey(key))
				return values.get(key).Value;
			return defValue;
		}

		public void setProperty(String key, String value) {
			boolean isuncommented = this.isCommentLine(key);
			if(isuncommented)
				key=key.substring(1);
			if (this.values.containsKey(key)) {
				this.values.get(key).Value = value;
				this.values.get(key).IsUncommented = isuncommented;
			} else {
				SectionValue sv = new SectionValue(value);
				sv.IsUncommented = isuncommented;
				this.values.put(key, sv);
			}
		}

		public void parseLines() {
			this.values.clear();
			List<String> commentsForValue = new ArrayList<String>();
			boolean uncommented = false;
			for (String line : rawLines) {

				if (this.isCommentLine(line)) {
					if (!line.contains(DELIMITER)) {
						commentsForValue.add(line);
						continue;
					} else {
						uncommented = true;
						line = line.substring(1);
					}
				}
				if (!line.contains(DELIMITER))
					continue;
				String hlp[] = line.split(DELIMITER);
				if(hlp.length>1)
				{
					String key=hlp[0];
					String value=line.length()>(key+DELIMITER).length()?line.substring((key+DELIMITER).length()):"";
					if (this.values.containsKey(key))
						this.values.get(key).Value = value;
					else {
						this.values.put(key, new SectionValue(value, commentsForValue, uncommented));
						commentsForValue = new ArrayList<String>();
					}
				}
				else
				{
					LOG.warn("ignoring unknown formatted line:"+line);
				}
				uncommented = false;
			}
		}

		private boolean isCommentLine(String line) {
			for (String c : commentChars) {
				if (line.startsWith(c))
					return true;
			}
			return false;
		}

		public String[] toLines() {
			List<String> lines = new ArrayList<String>();
			if (!this.Name.isEmpty())
				lines.add("[" + this.Name + "]");
			for (Entry<String, SectionValue> entry : this.values.entrySet()) {
				if (entry.getValue().Comments.size() > 0) {
					for (String comment : entry.getValue().Comments)
						lines.add(comment);
				}
				lines.add((entry.getValue().IsUncommented ? commentChars[0] : "") + entry.getKey() + DELIMITER
						+ entry.getValue().Value);
			}
			String[] alines = new String[lines.size()];
			return lines.toArray(alines);
		}

		public String getString(String key, String def) {
			return this.getProperty(key, def);
		}

		public boolean getBoolean(String key, boolean def) throws ConversionException {
			String v = this.getProperty(key);
			if (v == null || v.isEmpty())
				return def;
			if (v.equals("true"))
				return true;
			if (v.equals("false"))
				return false;
			throw new ConversionException("invalid value for key " + key);
		}

		public int getInt(String key, int def) throws ConversionException {
			String v = this.getProperty(key);
			if (v == null || v.isEmpty())
				return def;
			try {
				return Integer.parseInt(v);
			} catch (NumberFormatException e) {
				throw new ConversionException(e.getMessage());
			}
		}

		public boolean hasValues() {
			return this.values.size()>0;
		}

		public boolean hasKey(String key) {
			return this.values.containsKey(key);
		}

	}

	private final File mFile;
	private final List<Section> sections;
	private static final String commentChars[] = { "#", ";" };

	public IniConfigurationFile(File f) {
		this.mFile = f;
		this.sections = new ArrayList<Section>();
		this.sections.add(new Section(SECTIONNAME_ROOT));

	}

	public void load() throws ConfigurationException {
		String curSectionName = SECTIONNAME_ROOT;
		LOG.debug("loading file");
		BufferedReader br = null;
		try {
			br = new BufferedReader(new FileReader(this.mFile));
			for (String line; (line = br.readLine()) != null;) {
				line = line.trim();
				if (line.isEmpty())
					continue;
				if (line.startsWith("[") && line.endsWith("]")) {
					curSectionName = line.substring(1, line.length() - 1);
					this.addSection(curSectionName);
				} else
					this.getSection(curSectionName).addLine(line);
			}

		} catch (Exception e) {
			throw new ConfigurationException(e.getMessage());
		} finally {
			try {
				if (br != null)
					br.close();
			} catch (IOException e) {
			}
		}
		LOG.debug("finished loading file");
		LOG.debug("start parsing sections");
		for (Section section : this.sections)
			section.parseLines();
		LOG.debug("finished parsing " + this.sections.size() + " sections");
	}

	private Section getSection(String name) {
		for (Section s : this.sections) {
			if (s.Name.equals(name))
				return s;
		}
		return this.addSection(name);

	}

	private Section addSection(String name) {

		Section s = new Section(name);
		this.sections.add(s);
		return s;
	}

	public void reLoad() throws ConfigurationException {
		this.sections.clear();
		this.sections.add(new Section(SECTIONNAME_ROOT));
		this.load();
	}

	public String getProperty(String key, String defValue) {
		Section s;
		if (key.contains(".")) {
			s = this.getSection(key.substring(0, key.indexOf(".")));
			key = key.substring(key.indexOf(".") + 1);
		} else
			s = this.getSection(SECTIONNAME_ROOT);

		String v = s.getProperty(key);
		if (v == null || v.isEmpty())
			return defValue;
		return v;
	}

	public void setProperty(String key, String value) {
		Section s;
		if (key.contains(".")) {
			s = this.getSection(key.substring(0, key.indexOf(".")));
			key = key.substring(key.indexOf(".") + 1);
		} else
			s = this.getSection(SECTIONNAME_ROOT);
		s.setProperty(key, value);
	}

	public int getProperty(String key, int defValue) throws ConversionException {
		Section s;
		if (key.contains(".")) {
			s = this.getSection(key.substring(0, key.indexOf(".")));
			key = key.substring(key.indexOf(".") + 1);
		} else
			s = this.getSection(SECTIONNAME_ROOT);

		return s.getInt(key, defValue);
	}

	public void setProperty(String key, int value) {
		Section s;
		if (key.contains(".")) {
			s = this.getSection(key.substring(0, key.indexOf(".")));
			key = key.substring(key.indexOf(".") + 1);
		} else
			s = this.getSection(SECTIONNAME_ROOT);
		s.setProperty(key, String.format("%d", value));
	}

	public boolean getProperty(String key, boolean defValue) throws ConversionException {
		Section s;
		if (key.contains(".")) {
			s = this.getSection(key.substring(0, key.indexOf(".")));
			key = key.substring(key.indexOf(".") + 1);
		} else
			s = this.getSection(SECTIONNAME_ROOT);

		return s.getBoolean(key, defValue);
	}

	public void setProperty(String key, boolean value) {
		Section s;
		if (key.contains(".")) {
			s = this.getSection(key.substring(0, key.indexOf(".")));
			key = key.substring(key.indexOf(".") + 1);
		} else
			s = this.getSection(SECTIONNAME_ROOT);
		s.setProperty(key, value ? "true" : "false");
	}

	public void setProperty(String key, Object value) {
		this.setProperty(key, value==null?"null":value.toString());
	}

	public void save() {
		final String LR = "\n";
		BufferedWriter bw;
		try {
			bw = new BufferedWriter(new FileWriter(this.mFile, false));
			for (Section section : this.sections) {
				if(section.hasValues())
					bw.write(String.join(LR, section.toLines()) + LR + LR);
			}
			bw.close();
		} catch (Exception e) {

		}

	}

	public Section subset(String section) {
		return this.getSection(section);
	}

}
