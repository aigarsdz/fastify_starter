class BaseModel {
	assignValues(source) {
		if (source) {
			Object.entries(source).forEach(([key, value]) => {
				if (this.hasOwnProperty(key)) {
					if (typeof this[key] == 'boolean') {
						this[key] = Boolean(value)
					} else {
						this[key] = value
					}
				}
			})
		}
	}
}

export default BaseModel