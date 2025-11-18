
export default class Personalia {
    constructor(personalia, personaliaElement) {
        this.personalia = personalia;
        this.personaliaElement = personaliaElement;

        this.cursor = this.createCursor();
        this.fillPersonalia();
    }

    async getAchievements() {
        try {
            const response = await globalThis.fetch('https://tt-achievements.th3a.dev/achievements/i.doll');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            this.personalia.Achievements = data;
        } catch (error) {
            console.error('Failed to fetch achievements:', error);
            this.personalia.Achievements = [];
        }
    }

    createField(key, value) {
        const field = globalThis.document.createElement('div');
        field.className = 'field';
        field.innerHTML = `<strong class="fn">${key}:</strong> `;

        if (Array.isArray(value)) {
            const list = globalThis.document.createElement('ul');
            list.style.listStyleType = 'none';
            list.style.padding = '0';
            list.style.margin = '0';
            list.style.marginLeft = '1em';
            field.appendChild(list);
            return { field, valueElement: list };
        } else {
            const valueSpan = globalThis.document.createElement('span');
            valueSpan.className = 'value';
            field.appendChild(valueSpan);
            return { field, valueElement: valueSpan };
        }
    }

    createCursor() {
        const cursor = globalThis.document.createElement('span');
        cursor.id = 'cursor';
        this.personaliaElement.appendChild(cursor);
        return cursor;
    }

    positionCursor(element) {
        if (this.cursor.parentNode) {
            this.cursor.parentNode.removeChild(this.cursor);
        }
        element.parentNode.insertBefore(this.cursor, element.nextSibling);
    }

    async typeText(element, text) {
        let textNode = globalThis.document.createTextNode('');
        element.appendChild(textNode);
        for (let char of text) {
            textNode.nodeValue += char;
            this.positionCursor(textNode);
            await new Promise(resolve => globalThis.setTimeout(resolve, 50 + Math.random() * 150));
        }
    }

    async fillPersonalia() {
        await this.getAchievements();
        for (let [key, value] of Object.entries(this.personalia)) {
            const { field, valueElement } = this.createField(key, value);
            this.personaliaElement.appendChild(field);

            if (Array.isArray(value)) {
                for (let item of value) {
                    const listItem = globalThis.document.createElement('li');
                    valueElement.appendChild(listItem);
                    await this.typeText(listItem, item);
                    await new Promise(resolve => globalThis.setTimeout(resolve, 200 + Math.random() * 300));
                }
            } else {
                await this.typeText(valueElement, value);
            }

            await new Promise(resolve => globalThis.setTimeout(resolve, 500 + Math.random() * 750));
        }
    }
}