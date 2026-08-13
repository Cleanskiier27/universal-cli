import { useState } from "react";
import Card from "./Card";

interface UserPermission {
  id: string;
  email: string;
  role: "Owner" | "Full" | "Restricted";
}

const initialUsers: UserPermission[] = [
  { id: "u1", email: "andrew@datacentral-cloud-llc.com", role: "Owner" },
  { id: "u2", email: "ops@datacentral-cloud-llc.com", role: "Full" },
  { id: "u3", email: "analyst@datacentral-cloud-llc.com", role: "Restricted" },
];

export default function Settings() {
  const [users, setUsers] = useState<UserPermission[]>(initialUsers);
  const [domain, setDomain] = useState("datacentral-cloud-llc.com");
  const [domainInput, setDomainInput] = useState("");
  const [verified, setVerified] = useState(true);

  function handleDomainChange(event: React.FormEvent) {
    event.preventDefault();
    if (!domainInput.trim()) return;
    setDomain(domainInput.trim());
    setVerified(false);
    setDomainInput("");
  }

  function updateRole(id: string, role: UserPermission["role"]) {
    setUsers((current) => current.map((user) => (user.id === id ? { ...user, role } : user)));
  }

  function removeUser(id: string) {
    setUsers((current) => current.filter((user) => user.id !== id));
  }

  return (
    <div className="view">
      <div className="view-header">
        <h1>Settings</h1>
        <p>Manage ownership verification, permissions, and property configuration.</p>
      </div>

      <Card title="Ownership Verification" subtitle="Domain / DNS verification status">
        <div className="verification-row">
          <span className={`badge ${verified ? "badge-success" : "badge-warning"}`}>
            {verified ? "Verified" : "Pending Verification"}
          </span>
          <p>
            Property: <strong>{domain}</strong>
          </p>
          {!verified && (
            <button type="button" className="secondary-button" onClick={() => setVerified(true)}>
              Re-verify now
            </button>
          )}
        </div>
      </Card>

      <Card title="User Permissions" subtitle="Manage access levels for this property">
        <table className="cc-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.email}</td>
                <td>
                  <select
                    value={user.role}
                    onChange={(event) => updateRole(user.id, event.target.value as UserPermission["role"])}
                  >
                    <option value="Owner">Owner</option>
                    <option value="Full">Full</option>
                    <option value="Restricted">Restricted</option>
                  </select>
                </td>
                <td>
                  <button
                    type="button"
                    className="danger-button"
                    onClick={() => removeUser(user.id)}
                    disabled={user.role === "Owner"}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <div className="grid-two">
        <Card title="Change Domain" subtitle="Update the primary property domain">
          <form className="inline-form" onSubmit={handleDomainChange}>
            <input
              type="text"
              placeholder="new-domain.com"
              value={domainInput}
              onChange={(event) => setDomainInput(event.target.value)}
              required
            />
            <button type="submit">Update</button>
          </form>
        </Card>

        <Card title="Remove Property" subtitle="Danger zone">
          <p>Removing this property will delete all indexing, income, and link history.</p>
          <button type="button" className="danger-button">
            Remove Property
          </button>
        </Card>
      </div>
    </div>
  );
}
