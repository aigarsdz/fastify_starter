class BaseModel {
	assignValues(source) {
		if (source) {
			Object.entries(source).forEach(([key, value]) => this[key] = value)
		}
	}
}

module.exports = BaseModel