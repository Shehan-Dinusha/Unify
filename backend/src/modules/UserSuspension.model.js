import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const UserSuspension = sequelize.define(
  "UserSuspension",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    caseReference: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    reasonTag: {
      type: DataTypes.ENUM('ToS Violation', 'Payment Failure', 'Suspicious Activity', 'Harassment'),
      allowNull: false,
    },
    severity: {
      type: DataTypes.ENUM('Critical', 'High', 'Medium', 'Low'),
      allowNull: false,
    },
    effectiveDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    suspensionDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    suspensionTime: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    adminNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    adminAction: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    identityVerificationComplete: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    securityAuditPassed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    status: {
      type: DataTypes.ENUM('ACTIVE', 'PENDING_APPEAL', 'REACTIVATED'),
      allowNull: false,
      defaultValue: 'ACTIVE',
    },
    reactivationDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    reactivationNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    reactivatedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    suspendedDaysAgo: {
      type: DataTypes.VIRTUAL,
      get() {
        if (!this.suspensionDate) return 0;
        return Math.floor((Date.now() - new Date(this.suspensionDate).getTime()) / (1000 * 60 * 60 * 24));
      }
    }
  },
  {
    tableName: "user_suspensions",
    timestamps: true,
    indexes: [
      { fields: ["userId"] },
      { fields: ["status"] },
      { fields: ["reasonTag"] },
      { fields: ["suspensionDate"] },
      { fields: ["caseReference"], unique: true }
    ]
  }
);

export default UserSuspension;
