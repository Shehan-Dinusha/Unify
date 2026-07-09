import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const ReviewFeedback = sequelize.define(
  "ReviewFeedback",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    reviewId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    isHelpful: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true, // true for helpful, false for not_helpful
    },
  },
  {
    tableName: "review_feedbacks",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["reviewId", "userId"],
        name: "unique_review_user_feedback",
      },
    ],
  },
);

export default ReviewFeedback;
