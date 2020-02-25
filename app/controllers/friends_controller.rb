# Copyright 2019, Ryan Sise

# This file is part of Podcast Interview Manager.

# Podcast Interview Manager is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.

# Podcast Interview Manager is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.

# You should have received a copy of the GNU General Public License
# along with Podcast Interview Manager.  If not, see <https://www.gnu.org/licenses/>.

class FriendsController < ApplicationController

  def index
    friends = Friend.all
    render json: friends, only: [:id, :name, :species, :description, :likes]
  end

  def show
    friend = Friend.find(params[:id])
    render json: {id:friend.id, name:friend.name, species:friend.species, description:friend.description, likes:friend.likes, comments:friend.comments}
  end

  def create
    friend = Friend.new(name:params[:name],species:params[:species],description:params[:description])
    friend.save
    render json: {id:friend.id, name:friend.name, species:friend.species, description:friend.description, likes:friend.likes, comments:friend.comments}
  end

  def update
    friend = Friend.find(params[:id])
    if params[:likes]
      friend.likes += 1
      friend.save
    elsif params[:comment]
      friend.comments.create(content:params[:comment])
      friend.save
    end
    render json: friend
  end
end
