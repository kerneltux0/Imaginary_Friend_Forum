class CreateFriends < ActiveRecord::Migration[5.2]
  def change
    create_table :friends do |t|
      t.string :name
      t.string :species
      t.string :description
      t.integer :likes, default: 0
      t.integer :comment_id
      t.timestamps
    end
  end
end
