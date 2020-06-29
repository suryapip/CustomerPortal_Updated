// A contact's roles are stored as individual boolean fields in the SFContacts table, not in a separate association table.
// The SFContactRole object and roles[] array are coded on the UI side for display purposes.
export class SFContactRole {

    constructor(name?: string, description?: string) {
        this.name = name;
        this.description = description;
    }
    public name: string;
    public description: string;
}
